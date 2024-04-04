const messages = {
  fr: {
    ' ': ' ',
    navbar_manageTenant: 'Mes tenants',
    navbar_manageAcl: 'Utilisateurs',
    navbar_manageInstance: 'Instances',
    createATenant: 'Créer un tenant',
    updateATenant: 'Modifier un tenant',
    create: 'Créer',
    update: 'Modifier',
    tenantName: 'Nom du tenant',
    orangeCartoCode: 'Code OrangeCarto',
    description: 'Description',
    cancel: 'Annuler',
    search: 'Rechercher',
    noTenantAvailable: 'Aucun tenant, cliquer sur le bouton "+" pour créer votre premier tenant !',
    itemsPerPage: 'Eléments par page',
    oopsPageNotFound: 'Oops. Page introuvable:',
    useNavigationLinks:
      'Utilisez les liens de navigation ci-dessus pour naviguer entre les différentes pages',
    thisFieldIsRequired: 'Ce champ est obligatoire',
    thisFieldMustContainBetween3And30Characters: 'Ce champ doit contenir entre 3 et 30 caractères',
    onlyHyphenIsAllowed: "Le trait d'union est le seul caractère spécial autorisé (e.g. Mon-Nom)",
    thisFieldMustContainBetween1And5Digits: 'Ce champ doit contenir entre 1 et 5 chiffres',
    thisFieldMustBeLessThan1000Characters: 'Ce champ doit comporter moins de 1000 caractères',
    success: 'Succès !',
    information: 'Information !',
    error: 'Erreur !',
    yourTenantHasBeenCreated: 'Votre tenant a été créé',
    yourTenantHasBeenUpdated: 'Votre tenant a été modifié',
    testMessageWithVariable: 'Ceci est un message avec {msg}',
    myTenants: 'Mes tenants',
    of: 'sur',
    creatingTenant:
      'Création de votre tenant en cours. Cette action peut prendre quelques secondes',
    deletingTenant:
      'Suppression de votre tenant en cours. Cette action peut prendre quelques secondes',
    confirm: 'Confirmation de suppression !',
    confirmTenantDeletion:
      'Vous êtes sur le point de supprimer le tenant {0}, il sera supprimé si plus aucune instance ne lui est rattachée. {1}',
    irreversibleAction: 'Cette action est irréversible.',
    theTenantHasBeenDeleted: 'Le tenant {tenantName} a été supprimé.',
    delete: 'Supprimer',
    updatingTenant:
      'Modification de votre tenant en cours. Cette action peut prendre quelques secondes',
    findOrangeCarto: "Cliquez sur l'icône pour rechercher votre code Orange Carto",
    tenantNameDoesNtMatch: 'Le nom du tenant saisi ne correspond pas',
    confirmName: 'Entrer le nom du tenant pour confirmer',
    confirmInstanceName: "Entrer le nom de l'instance pour confirmer",
    myAcls: 'Utilisateurs',
    myInstances: 'Instances',
    selectATenant: 'Selectionner un tenant',
    noAclAvailable: "Aucune donnée, veuillez d'abord sélectionner un tenant pour lister ses accès",
    noInstanceAvailable:
      "Aucune donnée, veuillez d'abord sélectionner un tenant pour lister ses instances",
    tooltipDeleteTenant: 'Supprimer le tenant',
    tooltipUpdateTenant: 'Modifier le tenant',
    tooltipOpenGrafana: 'Ouvrir Grafana dans un nouvel onglet',
    tooltipOpenManageAcl: 'Gérer les droits du tenant',
    tooltipOpenManageInstance: 'Gérer les instances du tenant',
    tooltipOpenInstance: "Ouvrir l'interface de l'instance",
    tooltipCreateTenant: 'Créer un Tenant',
    tooltipCreateAcl: 'Créer un accès au tenant',
    tooltipUpdateAcl: 'Modifier le rôle',
    tooltipDeleteAcl: 'Supprimer le rôle',
    tooltipCreateInstance: 'Créer une instance',
    tooltipDeleteInstance: "Supprimer l'instance",
    tooltipAddTeam:
      'Seuls les admistrateurs MOOD peuvent créer des équipes, vous pouvez en faire la demande via mail ou mattermost',
    user: 'User',
    team: 'Team',
    viewer: 'Viewer',
    member: 'Member',
    administrator: 'Admin',
    createAclText:
      "Veuillez remplir ce formulaire pour ajouter un accès au tenant {0}. {1} Vous pouvez consulter le fonctionnement du contrôle d'accès {2}.",
    here: 'ici',
    // TODO: Multipass -> update CUID
    enterCUIDOrTeamName: "Entrez le mail / nom d'équipe",
    createAnAcl: 'Créer un accès: {0}',
    yourAclHasBeenCreated: 'Votre nouvel accès a été créé',
    creatingAcl: 'Création de votre accès en cours. Cette action peut prendre quelques secondes',
    updateAclText:
      "Vous pouvez modifier le rôle de l'accès au tenant {0}. {1} Vous pouvez consulter le fonctionnement du contrôle d'accès {2}.",
    updateAnAcl: 'Modifier un accès: {0}',
    yourAclHasBeenUpdated: 'Votre accès a été modifié',
    updatingAcl:
      'Modification de votre accès en cours. Cette action peut prendre quelques secondes',
    deleteAnAcl: 'Supprimer un accès: {0} / {1}',
    deletingAcl: 'Suppression de votre accès en cours. Cette action peut prendre quelques secondes',
    confirmAclDeletion: "Vous êtes sur le point de supprimer l'accès au tenant {0} à {1}. {2}",
    deleteAnInstance: 'Supprimer une instance: {0} / {1}',
    deletingInstance:
      'Suppression de votre instance en cours. Cette action peut prendre quelques secondes',
    confirmInstanceDeletion: "Vous êtes sur le point de supprimer l'instance {0} {1}. {2}",
    canTDeleteLastAdmin: 'Vous ne pouvez pas supprimer le dernier admin !',
    theAclHasBeenDeleted: "L'accès a été supprimé",
    theInstanceHasBeenDeleted: "L'instance a été supprimée",
    owner: 'Nom',
    role: 'Role',
    name: 'Nom',
    visibility: 'Visibilité',
    type: 'Type',
    createAnInstance: 'Créer une instance',
    createInstanceText: 'Veuillez remplir ce formulaire pour ajouter une instance au tenant {0}.',
    enterInstanceName: "Nom de l'instance",
    creatingInstance:
      'Création de votre instance en cours. Cette action peut prendre quelques secondes',
    yourInstanceHasBeenCreated: 'Votre instance a été créée',
    updateAnInstance: "Modifier l'instance",
    updateInstanceText: "Vous pouvez modifier l'instance rattachée au tenant: {0}.",
    updatingInstance:
      'Modification de votre instance en cours. Cette action peut prendre quelques secondes',
    yourInstanceHasBeenUpdated: 'Votre instance a été modifié',
    prometheus: 'prometheus',
    alertmanager: 'alertmanager',
    victoria: 'victoriametrics',
    private: 'private',
    internal: 'internal',
    hello: 'Bonjour',
    enterMail: "Entrez l'adresse mail",
    enterTeamName: "Entrez le nom de l'équipe"
  },
  en: {
    ' ': ' ',
    navbar_manageTenant: 'My tenants',
    navbar_manageAcl: 'Users',
    navbar_manageInstance: 'Instances',
    createATenant: 'Create a tenant',
    updateATenant: 'Update a tenant',
    create: 'Create',
    update: 'Update',
    tenantName: 'Tenant name',
    orangeCartoCode: 'OrangeCarto code',
    description: 'Description',
    cancel: 'Cancel',
    search: 'Search',
    noTenantAvailable: 'No tenant, click on the "+" button to create your first tenant !',
    itemsPerPage: 'Items per page',
    oopsPageNotFound: 'Oops. Page not found:',
    useNavigationLinks: 'Use the navigation links above to navigate between pages.',
    thisFieldIsRequired: 'This field is required',
    thisFieldMustContainBetween3And30Characters:
      'This field must contain between 3 and 30 characters',
    onlyHyphenIsAllowed: 'The hyphen is the only special character allowed (e.g. My-Name)',
    thisFieldMustContainBetween1And5Digits: 'This field must contain between 1 and 5 digits',
    thisFieldMustBeLessThan1000Characters: 'This field must be less than 1000 characters',
    success: 'Success !',
    information: 'Information !',
    error: 'Error !',
    yourTenantHasBeenCreated: 'Your tenant has been created',
    yourTenantHasBeenUpdated: 'Your tenant has been Updated',
    testMessageWithVariable: 'Here is a message with {msg}',
    myTenants: 'My tenants',
    of: 'of',
    creatingTenant: 'Creating your tenant. This action may take a few seconds',
    deletingTenant: 'Deleting your tenant. This action may take a few seconds',
    confirm: 'Confirmation of deletion !',
    confirmTenantDeletion:
      'You are about to delete the tenant {0}, it will be deleted if no more instances are attached to it. {1}',
    irreversibleAction: 'This action is irreversible.',
    theTenantHasBeenDeleted: 'The tenant {tenantName} has been deleted.',
    delete: 'Delete',
    updatingTenant: 'Updating your tenant. This action may take a few seconds',
    findOrangeCarto: 'Click on the icon to search for your Orange Carto code',
    tenantNameDoesNtMatch: 'The tenant name entered does not match',
    confirmName: "Enter tenant's name to confirm",
    confirmInstanceName: "Enter instance's name to confirm",
    myAcls: 'Users',
    myInstances: 'Instances',
    selectATenant: 'Select a tenant',
    noAclAvailable: 'No data, please first select a tenant to list these users',
    noInstanceAvailable: 'No data, please first select a tenant to list these instances',
    tooltipDeleteTenant: 'Delete the tenant',
    tooltipUpdateTenant: 'Update the tenant',
    tooltipOpenGrafana: 'Open Grafana in a new tab',
    tooltipOpenManageAcl: 'Manage tenant rights',
    tooltipOpenManageInstance: 'Manage tenant instances',
    tooltipOpenInstance: 'Open instance interface',
    tooltipCreateTenant: 'Create a Tenant',
    tooltipCreateAcl: 'Create access to the tenant',
    tooltipUpdateAcl: 'Update role',
    tooltipDeleteAcl: 'Delete role',
    tooltipCreateInstance: 'Create instance',
    tooltipDeleteInstance: 'Delete instance',
    tooltipAddTeam:
      'Only MOOD administrators are authorized to create new teams. Please contact us by mail or mattermost to create a new team',
    user: 'User',
    team: 'Team',
    viewer: 'Viewer',
    member: 'Member',
    administrator: 'Admin',
    createAclText:
      'Please fill in this form to add an access to tenant {0}. {1} You can find how access control works {2}.',
    here: 'here',
    // TODO: Multipass -> update CUID
    enterCUIDOrTeamName: 'Enter mail / team name',
    createAnAcl: 'Create access to your tenant',
    yourAclHasBeenCreated: 'Your new access has been created',
    creatingAcl: 'Creating your access. This action may take a few seconds',
    updateAclText:
      'You can update the role of access to the tenant {0}. {1} You can find how access control works {2}.',
    updateAnAcl: 'Update access: {0}',
    yourAclHasBeenUpdated: 'Your new access has been updated',
    updatingAcl: 'Updating your access. This action may take a few seconds',
    deleteAnAcl: 'Delete an access: {0} / {1}',
    deletingAcl: 'Deleting your access. This action may take a few seconds',
    confirmAclDeletion: 'You are about to remove access to tenant {0} to {1}. {2}',
    deleteAnInstance: 'Delete an instance: {0} / {1}',
    deletingInstance: 'Deleting your instance. This action may take a few seconds',
    confirmInstanceDeletion: 'You are about to remove {0} instance {1}. {2}',
    canTDeleteLastAdmin: "You can't remove the last admin!",
    theAclHasBeenDeleted: 'Access removed',
    theInstanceHasBeenDeleted: 'Instance removed',
    owner: 'Name',
    role: 'Role',
    name: 'Name',
    visibility: 'Visibility',
    type: 'Type',
    createAnInstance: 'Create a new instance',
    createInstanceText: 'Please fill in this form to add an instance to tenant {0}.',
    enterInstanceName: 'Instance name',
    creatingInstance: 'Creating your instance. This action may take a few seconds',
    yourInstanceHasBeenCreated: 'Your new instance has been created',
    updateAnInstance: 'Update instance',
    updateInstanceText: 'You can update the instance attached to tenant: {0}.',
    updatingInstance: 'Updating your instance. This action may take a few seconds',
    yourInstanceHasBeenUpdated: 'Your instance has been updated',
    prometheus: 'prometheus',
    alertmanager: 'alertmanager',
    victoria: 'victoriametrics',
    private: 'private',
    internal: 'internal',
    hello: 'Hello',
    enterMail: 'Enter e-mail address',
    enterTeamName: 'Enter team name'
  }
}

export default messages
