import blessed from 'blessed'

export default function newDashboard(menuItems) {
  const dashboard = new blessed.Element()

  const menuBar = new blessed.ListBar({
    height: 1,
    keys: true,
    left: 0,
    style: {
      bg: '#87CEFA',
      item: {
        bg: '#87CEFA',
        fg: 'grey',
      },
      selected: {
        bg: '#00BFFF',
        fg: '#000080',
      },
    },
    top: 0,
    width: '100%',
  })

  menuBar.setItems(menuItems.map(box => {
    return () => {
      dashboard.children = dashboard.children.slice(0, 1)
      dashboard.append(box)
      box.focus()
    }
  }).toJS())

  menuBar.items.forEach(item => {
    // Remove the prefixes from the item titles
    item.setContent(item._.cmd.text)
  })

  dashboard.on('attach', () => {
    dashboard.children[1].focus()
  })

  dashboard.append(menuBar)
  dashboard.append(menuItems.first())

  return dashboard
}
