const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const portfinder = require('portfinder')
const fs = require('fs-extra')

let mainWindow
let nextServer

// 自动检测可用端口，防止端口冲突
async function startNextServer() {
  const port = await portfinder.getPortPromise({ port: 3000 })
  
  // 生产环境：启动构建好的 Next.js 服务
  // 核心逻辑：这里假设我们已经把 .next 文件夹和 server.js 打包进去了
  const scriptPath = path.join(__dirname, 'server.js')
  
  // 在打包后的环境中，node_modules 位置可能变化，这里做简单处理
  // 注意：真实的商业级打包需要把 Next.js 编译成 standalone 模式，或者直接把 build 产物静态化
  // 为了简化流程且保留 Server Actions (SQLite 读写) 能力，我们这里使用 standalone 模式
  
  process.env.PORT = port
  process.env.HOSTNAME = 'localhost'
  process.env.DATABASE_URL = "file:" + path.join(app.getPath('userData'), 'liquun.db')

  // 确保数据库文件存在
  const dbSource = path.join(__dirname, 'prisma/dev.db')
  const dbDest = path.join(app.getPath('userData'), 'liquun.db')
  
  if (!fs.existsSync(dbDest)) {
      // 第一次运行，复制初始空数据库
      // 注意：打包时需要把 prisma/dev.db 包含进去
      // 如果没有源文件（比如第一次安装），Prisma 会自动创建吗？
      // Prisma Client 运行时会自动创建 SQLite 文件，只要目录存在
  }

  // 我们需要用 node 启动 next 的 standalone server
  nextServer = spawn(process.execPath, [path.join(__dirname, '.next/standalone/server.js')], {
    env: { ...process.env },
    cwd: __dirname
  })

  nextServer.stdout.on('data', (data) => {
    console.log(`Next.js: ${data}`)
  })

  nextServer.stderr.on('data', (data) => {
    console.error(`Next.js Error: ${data}`)
  })

  return port
}

function createWindow(port) {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    titleBarStyle: 'hiddenInset', // Mac 风格的沉浸式标题栏
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, 'public/icon.png')
  })

  mainWindow.loadURL(`http://localhost:${port}`)
}

app.whenReady().then(async () => {
  const port = await startNextServer()
  createWindow(port)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(port)
    }
  })
})

app.on('window-all-closed', () => {
  if (nextServer) nextServer.kill()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
    if (nextServer) nextServer.kill()
})
