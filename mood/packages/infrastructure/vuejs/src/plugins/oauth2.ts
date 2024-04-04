import { Navigation, NavigationRoute, Store } from '@mood/web-adapters'
import * as oauth2 from 'oauth4webapi'

const config = {
  issuer: new URL(process.env.VITE_MULTIPASS_ISSUER_URI),
  algorithm: process.env.VITE_MULTIPASS_ALGORITHM /* For .well-known/openid-configuration discovery */ as
    | 'oidc'
    | 'oauth2'
    | undefined,
  redirect_uri: process.env.VITE_MULTIPASS_REDIRECT_URI,
  client_id: process.env.VITE_MULTIPASS_CLIENT_ID,
  client_secret: undefined,
  code_challenge_method: process.env.VITE_MULTIPASS_CODE_CHALLENGE
}

let nonce: string | undefined
export interface Authenticate {
  login(): Promise<void>
  refreshToken(): Promise<UserASInformation>
  saveUserInfo(data: any): Promise<void>
  userInfo(): Promise<UserInformation>
  userNeedToLogin(): Promise<boolean>
}

export interface UserASInformation {
  accessToken?: string
  idToken?: string
  refreshToken?: string
  codeVerifier?: string
}

export interface UserInformation {
  sub?: string
  name?: string
  email?: string
}

export type FullUserInformation = UserASInformation & UserInformation

export class Oauth2Authenticate implements Authenticate {
  private codeVerifier?: string
  private client?: oauth2.Client
  private config = config

  constructor(
    public navigation: Navigation,
    public storage: Store<FullUserInformation>
  ) {
    this.codeVerifier = storage.get()?.codeVerifier ?? oauth2.generateRandomCodeVerifier()
    storage.set({ codeVerifier: this.codeVerifier })
    this.client = {
      client_id: this.config.client_id,
      client_secret: this.config.client_secret,
      token_endpoint_auth_method: 'none'
    }
  }

  async userNeedToLogin(): Promise<boolean> {
    try {
      return this.accessTokenExpired()
    } catch (err) {
      console.error('Decode access token error :', err)
    }
    return true
  }

  private accessTokenExpired(): boolean {
    const accessToken = this.storage.get()?.accessToken
    if (!accessToken) {
      return true
    }
    const decodeToken = this.decodeToken(accessToken)
    return decodeToken.exp > Date.now()
  }

  private decodeToken(accessToken: string) {
    return JSON.parse(atob(accessToken.split('.')[1]))
  }

  private async initFlow(): Promise<URL> {
    const algorithm = this.config.algorithm
    // Multipass Step : retreive authorization_endpoint from service issuer/.well-known/oauth-authorization-server
    const as: oauth2.AuthorizationServer = await oauth2
      .discoveryRequest(new URL(this.config.issuer), { algorithm })
      .then((response) => oauth2.processDiscoveryResponse(new URL(this.config.issuer), response))

    const codeChallenge: string = await oauth2.calculatePKCECodeChallenge(this.codeVerifier!)
    const authorizationUrl = new URL(as.authorization_endpoint!)
    authorizationUrl.searchParams.set('client_id', process.env.VITE_MULTIPASS_CLIENT_ID)
    authorizationUrl.searchParams.set('redirect_uri', process.env.VITE_MULTIPASS_REDIRECT_URI)
    authorizationUrl.searchParams.set('response_type', 'code')
    authorizationUrl.searchParams.set('scope', 'openid email profile')
    authorizationUrl.searchParams.set('code_challenge', codeChallenge)
    authorizationUrl.searchParams.set('code_challenge_method', this.config.code_challenge_method)

    /**
     * We cannot be sure the AS supports PKCE so we're going to use nonce too. Use of PKCE is
     * backwards compatible even if the AS doesn't support it which is why we're using it regardless.
     */
    if (as.code_challenge_methods_supported?.includes('S256') !== true) {
      nonce = oauth2.generateRandomNonce()
      authorizationUrl.searchParams.set('nonce', nonce)
    }
    // Multipass Step : return Multipass login page (choice between PKI/AD)
    return authorizationUrl
  }

  private async oauthFlow(): Promise<FullUserInformation> {
    const as = await oauth2
      .discoveryRequest(new URL(this.config.issuer))
      .then((response) => oauth2.processDiscoveryResponse(new URL(this.config.issuer), response))

    const currentUrl: URL = new URL(document.location.href)
    if (!this.client) {
      throw new Error('OAuth2 client not defined')
    }
    // Multipass Step : Verify state
    const params = oauth2.validateAuthResponse(as, this.client, currentUrl)
    if (oauth2.isOAuth2Error(params)) {
      console.error('Error Response', params)
      throw new Error('Redirection to Oauth2 Provider error') // Handle OAuth 2.0 redirect error
    }
    if (!this.codeVerifier) {
      throw new Error('No code verifier found')
    }
    // Multipass Step : request access_token (using OneTimeAuthorizationCode)
    const response = await oauth2.authorizationCodeGrantRequest(
      as,
      this.client,
      params,
      this.config.redirect_uri,
      this.codeVerifier
    )
    // Multipass Step : give ACCESS_TOKEN,REFRESH_TOKEN
    // For info about result, check oauth2.OpenIDTokenEndpointResponse
    const result = await oauth2.processAuthorizationCodeOpenIDResponse(
      as,
      this.client,
      response!,
      nonce
    )
    if (oauth2.isOAuth2Error(result)) {
      const errorMessage = 'OAuth 2.0 response body error : ' + result.error
      throw new Error(errorMessage)
    }
    const claims = oauth2.getValidatedIdTokenClaims(result)
    /** Claims example
        acr: "0"
        at_hash: "5ti...tA"
        aud: "cb69b4f3-...-3dc8ae25bf7a"
        auth_time: 1709289022
        azp: "cb69b4f3-...-3dc8ae25bf7a"
        email: "nicolas.boyet.ext@orange.com"
        email_verified: false
        exp: 1709290812
        family_name: "Boyet"
        given_name: "Nicolas"
        iat: 1709290512
        iss: "https://authz.apps.orange/realms/multipass"
        jti: "074106f5-...-679d8aa2e7e0"
        name: "Nicolas Boyet"
        preferred_username: "nicolas.boyet.ext@orange.com"
        session_state: "f17fa062-...-4f16696ae442"
        sid: "f17fa062-...-4f16696ae442"
        sub: "955202cb-...-8802d25d5c27"
        typ: "ID"
     */
    const accessToken = result.access_token
    const idToken = result.id_token
    const sub = claims.sub
    const refreshToken = result.refresh_token ?? ''
    const name = (claims.name as string) ?? ''

    return { accessToken, idToken, sub, refreshToken, name }
  }

  async userInfo(): Promise<UserInformation> {
    // TODO: Check if using this is really needed
    // const algorithm = this.config.algorithm
    // const as = await oauth2
    //   .discoveryRequest(new URL(this.config.issuer), { algorithm })
    //   .then((response) => oauth2.processDiscoveryResponse(new URL(this.config.issuer), response))
    // if (!this.client) {
    //   throw new Error('OAuth2 client not defined')
    // }
    // const accessToken = this.storage.get()?.accessToken ?? ''
    // const response = await oauth2.userInfoRequest(as, this.client, accessToken)

    // let challenges: oauth2.WWWAuthenticateChallenge[] | undefined
    // if ((challenges = oauth2.parseWwwAuthenticateChallenges(response))) {
    //   for (const challenge of challenges) {
    //     console.error('WWW-Authenticate Challenge', challenge)
    //   }
    //   throw new Error() // Handle WWW-Authenticate Challenges as needed
    // }
    // const storedSub = this.storage.get()?.sub ?? ''
    // const result = await oauth2.processUserInfoResponse(as, this.client, storedSub, response)
    // const sub = result.sub
    // const name = result.name as string
    // const email = result.email
    // return { sub, name, email }
    const name = this.storage.get()?.name
    return { name }
  }

  async login(): Promise<void> {
    if (window.location.href.includes('code=')) {
      // Multipass Step : OnetimeAuthorizationCode + state on client redirect URI
      const data = await this.oauthFlow()
      this.saveUserInfo(data)
      this.navigation.navigate(NavigationRoute.TENANTS)
      return
    }

    const refreshToken = this.storage.get()?.refreshToken

    if (refreshToken) {
      try {
        const data = await this.refreshToken()
        this.saveUserInfo(data)
        return
      } catch (err) {
        console.log('Refresh token error : ', err)
      }
    }
    const url = await this.initFlow()
    // Multipass Step : redirect to this URL/params
    // Multipass Step : Authorization Request to choose authentication method
    window.location.assign(url)
  }

  async saveUserInfo(data: FullUserInformation) {
    const formatData = {
      ...this.storage.get(),
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      idToken: data.idToken,
      sub: data.sub,
      name: data.name
    }
    this.storage.set(formatData)
  }

  async refreshToken(): Promise<FullUserInformation> {
    const rToken = this.storage.get()?.refreshToken
    if (!rToken) {
      throw new Error('Refresh Token not found')
    }
    const as = await oauth2
      .discoveryRequest(this.config.issuer)
      .then((response) => oauth2.processDiscoveryResponse(this.config.issuer, response))
    const response = await oauth2.refreshTokenGrantRequest(as, this.client!, rToken)

    let challenges: oauth2.WWWAuthenticateChallenge[] | undefined
    if ((challenges = oauth2.parseWwwAuthenticateChallenges(response))) {
      for (const challenge of challenges) {
        console.error('WWW-Authenticate Challenge', challenge)
      }
      throw new Error('An error occurred processing www-authenticate challenges') // Handle WWW-Authenticate Challenges as needed
    }

    const result = await oauth2.processRefreshTokenResponse(as, this.client!, response)
    if (oauth2.isOAuth2Error(result)) {
      const err: string = result.error_description || ''
      throw new Error(err)
    }

    const accessToken = result.access_token ?? ''
    const idToken = result.id_token ?? ''
    const refreshToken = result.refresh_token ?? ''

    return { accessToken, idToken, refreshToken }
  }
}
