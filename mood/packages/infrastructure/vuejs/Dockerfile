FROM dockerproxy.repos.tech.orange/nginx:1.24.0

ARG version=local

ENV VITE_BASE_URL="interface.mood.si.fr.intraorange" \
  VITE_API_REDIRECT="/api" \
  VITE_MOOD_API_URL="http://mood-api:8000/v1" \
  VITE_DOC_URL="https://docs.mood.si.fr.intraorange/" \
  VITE_CGU_URL="https://docs.mood.si.fr.intraorange/mood/cgu.html" \
  VITE_FAQ_URL="https://docs.mood.si.fr.intraorange/faq/index.html" \
  VITE_SUPPORT_MAIL="support.mood@orange.com" \
  VITE_SUPPORT_MATTERMOST="https://mattermost.tech.orange/cloud-orange/channels/metrologs--mood" \
  VITE_IN_MEMORY_REPOSITORY=false

# LABEL org.opencontainers.image.url=$CI_PROJECT_URL \
#     org.opencontainers.image.source=$CI_PROJECT_URL \
#     org.opencontainers.image.title=$CI_PROJECT_PATH \
#     org.opencontainers.image.ref.name=$CI_COMMIT_REF_NAME \
#     org.opencontainers.image.revision=$CI_COMMIT_SHA \
#     org.opencontainers.image.created=$CI_JOB_STARTED_AT
# LABEL org.opencontainers.image.version=${version}

WORKDIR /packages/infrastructure/vuejs

RUN mkdir /app
COPY --chown=101:101 dist /app
COPY --chown=101:101 nginx.conf /etc/nginx/nginx.conf

RUN chown 101:101 /var/cache/nginx && \
  mkdir -p /var/cache/nginx/client_temp && \
  chown 101:101 /var/cache/nginx/client_temp && \
  chmod -R +x /var/cache/nginx && \
  chown -R 101:101 /etc/nginx && \
  touch /run/nginx.pid && \
  chown -R 101:101 /run


EXPOSE 8090

USER 101
