interface NavItem {
  href?: string
  items?: NavItem[]
}

export function isNavItemActive(item: NavItem | null | undefined, currentPath: string): boolean {
  if (!item) return false
  
  if (item.href && item.href !== '#') {
    const itemPath = item.href.split(/[?#]/)[0]
    const cleanPath = currentPath.split(/[?#]/)[0]

    if (cleanPath === itemPath) return true

    if (itemPath !== '/' && cleanPath.startsWith(itemPath + '/')) return true
  }

  if (item.items) {
    return item.items.some(child => isNavItemActive(child, currentPath))
  }
  
  return false
}
