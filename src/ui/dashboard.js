import blessed from 'blessed'

export default function getDashboard() {
  const dashboard = new blessed.Element()

  const body = new blessed.Box({
    content: 'Content body.',
    height: '99%',
    left: 0,
    top: 1,
    width: '100%',
  })

  const menuItems = {
    'Linter': () => body.setContent('Linter!!'),
    'Tests': () => body.setContent('Tests!!'),
    'Compiler': () => body.setContent('Compiler!!'),
    'Server': () => body.setContent('Server!!'),
  }

  const menuBar = new blessed.ListBar({
    height: 1,
    items: menuItems,
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

  menuBar.items.forEach(item => {
    // Remove the prefixes from the item titles
    item.setContent(item._.cmd.text)
  })

  menuBar.on('attach', () => {
    menuBar.focus()
  })

  dashboard.append(menuBar)
  dashboard.append(body)

  return dashboard
}
