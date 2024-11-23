resource "azurerm_kubernetes_cluster" "aks" {
  name                      = "aks-${var.application}-${random_string.random_string.result}"
  dns_prefix                = replace("${var.application}", "-", "")
  location                  = var.location
  resource_group_name       = azurerm_resource_group.rg.name
  kubernetes_version        = "1.30.6"
  automatic_upgrade_channel = "patch"
  network_profile {
    network_plugin      = "azure"
    network_plugin_mode = "overlay"
  }
  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_DS2_v2"
  }

  identity {
    type = "SystemAssigned"
  }
  api_server_access_profile {
    authorized_ip_ranges = [
      "157.125.75.171/32",
      "147.161.145.81/32"
    ]
  }

  tags = local.tags
}


resource "azurerm_container_registry" "acr" {
  location            = azurerm_resource_group.rg.location
  name                = replace("acr${var.application}${random_string.random_string.result}", "-", "")
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "Basic"

  tags = local.tags
}

resource "azurerm_role_assignment" "aks_acr_role_assignment" {
  principal_id                     = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
  scope                            = azurerm_container_registry.acr.id
  role_definition_name             = "AcrPull"
  skip_service_principal_aad_check = true

}
