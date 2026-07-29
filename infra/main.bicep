@description('Name prefix for portal migration resources')
param resourcePrefix string = 'joned-portal'

@description('Azure region for the private portal')
param location string = resourceGroup().location

@description('Static Web App SKU')
@allowed([
  'Free'
  'Standard'
])
param staticWebAppSku string = 'Standard'

@description('Portal custom domain')
param portalHostname string = 'portal.jonedtransport.com'

@description('Enable custom domain binding during deployment')
param enableCustomDomain bool = false

@description('Portal Entra app client id')
param aadClientId string = ''

@secure()
@description('Portal Entra app client secret')
param aadClientSecret string = ''

var uniqueSuffix = uniqueString(resourceGroup().id)
var staticSiteName = '${resourcePrefix}-swa-${uniqueSuffix}'

resource portalSite 'Microsoft.Web/staticSites@2022-09-01' = {
  name: staticSiteName
  location: location
  sku: {
    name: staticWebAppSku
    tier: staticWebAppSku
  }
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    buildProperties: {
      appLocation: '/'
      outputLocation: 'dist'
    }
    allowConfigFileUpdates: true
  }
}

resource portalSettings 'Microsoft.Web/staticSites/config@2022-09-01' = {
  parent: portalSite
  name: 'appsettings'
  properties: {
    AAD_CLIENT_ID: aadClientId
    AAD_CLIENT_SECRET: aadClientSecret
    PORTAL_PRIVATE_MODE: 'true'
    PORTAL_DOMAIN_NAME: portalHostname
  }
}

resource portalDomain 'Microsoft.Web/staticSites/customDomains@2022-09-01' = if (enableCustomDomain) {
  parent: portalSite
  name: portalHostname
  properties: {}
}

output staticWebAppName string = portalSite.name
output staticWebAppDefaultHostname string = portalSite.properties.defaultHostname
output portalCustomDomain string = enableCustomDomain ? portalDomain.name : ''
