import React, { useState, useEffect } from 'react'
import { Menu, Search, ShoppingCart, ChevronDown, Plus, Minus, X, ArrowLeft, User, BarChart, Users, Store, DollarSign, TrendingUp, Shield } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"

const products = [
  { id: 1, name: "スマートフォン", price: 79800, store: "東京", category: "電子機器" },
  { id: 2, name: "ノートパソコン", price: 124800, store: "大阪", category: "電子機器" },
  { id: 3, name: "ワイヤレスイヤホン", price: 19800, store: "名古屋", category: "オーディオ" },
  { id: 4, name: "デジタルカメラ", price: 68000, store: "東京", category: "カメラ" },
  { id: 5, name: "スマートウォッチ", price: 32800, store: "大阪", category: "ウェアラブル" },
  { id: 6, name: "ゲーミングマウス", price: 8980, store: "名古屋", category: "周辺機器" },
  { id: 7, name: "4Kモニター", price: 54800, store: "東京", category: "周辺機器" },
  { id: 8, name: "ポータブルSSD", price: 15800, store: "大阪", category: "ストレージ" },
  { id: 9, name: "ワイヤレスキーボード", price: 12800, store: "名古屋", category: "周辺機器" },
]

const adminData = {
  totalRevenue: 15000000,
  totalSales: 500,
  storeInfo: [
    { name: "東京", revenue: 6000000, sales: 200 },
    { name: "大阪", revenue: 5000000, sales: 180 },
    { name: "名古屋", revenue: 4000000, sales: 120 },
  ],
  activeUsers: 1000,
  newCustomers: 50,
}

export default function Component() {
  const [selectedStore, setSelectedStore] = useState("全店舗")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState('main')
  const [orderDetails, setOrderDetails] = useState(null)
  const [purchaseHistory, setPurchaseHistory] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const filteredProducts = selectedStore === "全店舗"
    ? products
    : products.filter(product => product.store === selectedStore)

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  const handleCheckout = () => {
    setCurrentPage('checkout')
    setIsCartOpen(false)
  }

  const handlePlaceOrder = (paymentMethod) => {
    const order = {
      items: cart,
      total: cartTotal,
      paymentMethod: paymentMethod,
      orderDate: new Date().toISOString(),
      orderId: Math.random().toString(36).substr(2, 9).toUpperCase(),
    }
    setOrderDetails(order)
    setPurchaseHistory(prevHistory => [...prevHistory, order])
    setCart([])
    setCurrentPage('orderComplete')
  }

  const getRecommendations = (product) => {
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3)
  }

  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin)
    if (!isAdmin) {
      setCurrentPage('adminDashboard')
    } else {
      setCurrentPage('main')
    }
  }

  const MainContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <img
            src={`/placeholder.svg?height=200&width=200&text=${product.name}`}
            alt={product.name}
            className="w-full h-48 object-cover cursor-pointer"
            onClick={() => {
              setSelectedProduct(product)
              setCurrentPage('productDetail')
            }}
          />
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-500">{product.store}店</p>
          </CardContent>
          <CardFooter className="p-4 flex justify-between items-center">
            <span className="text-lg font-bold">¥{product.price.toLocaleString()}</span>
            <Button onClick={() => addToCart(product)}>カートに追加</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  const ProductDetailContent = () => {
    if (!selectedProduct) return null

    const recommendations = getRecommendations(selectedProduct)

    return (
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => setCurrentPage('main')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> 商品一覧に戻る
        </Button>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={`/placeholder.svg?height=400&width=400&text=${selectedProduct.name}`}
              alt={selectedProduct.name}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">{selectedProduct.name}</h2>
            <p className="text-xl font-semibold mb-4">¥{selectedProduct.price.toLocaleString()}</p>
            <p className="text-gray-600 mb-4">{selectedProduct.store}店</p>
            <p className="text-gray-600 mb-4">カテゴリー: {selectedProduct.category}</p>
            <Button onClick={() => addToCart(selectedProduct)} className="w-full">カートに追加</Button>
          </div>
        </div>
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-4">おすすめ商品</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <img
                  src={`/placeholder.svg?height=150&width=150&text=${product.name}`}
                  alt={product.name}
                  className="w-full h-36 object-cover cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(product)
                    setCurrentPage('productDetail')
                  }}
                />
                <CardContent className="p-4">
                  <h4 className="text-lg font-semibold">{product.name}</h4>
                  <p className="text-sm text-gray-500">¥{product.price.toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const CheckoutContent = () => (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" onClick={() => setCurrentPage('main')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> 買い物を続ける
      </Button>
      <h2 className="text-2xl font-bold mb-4">注文確認</h2>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h3 className="font-semibold mb-2">注文内容</h3>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <span>{item.name} x {item.quantity}</span>
            <span>¥{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <Separator className="my-2" />
        <div className="flex justify-between items-center font-bold">
          <span>合計</span>
          <span>¥{cartTotal.toLocaleString()}</span>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-2">お支払い方法</h3>
        <RadioGroup defaultValue="credit_card">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="credit_card" id="credit_card" />
            <Label htmlFor="credit_card">クレジットカード</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="convenience_store" id="convenience_store" />
            <Label htmlFor="convenience_store">コンビニ決済</Label>
          </div>
        </RadioGroup>
      </div>
      <Button onClick={() => handlePlaceOrder('credit_card')} className="w-full">注文を確定する</Button>
    </div>
  )

  const OrderCompleteContent = () => (
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">ご注文ありがとうございます！</h2>
      <p className="mb-4">注文番号: {orderDetails.orderId}</p>
      <p className="mb-4">注文日時: {new Date(orderDetails.orderDate).toLocaleString()}</p>
      <p className="mb-4">合計金額: ¥{orderDetails.total.toLocaleString()}</p>
      <Button onClick={() => setCurrentPage('main')}>買い物を続ける</Button>
    </div>
  )

  const PurchaseHistoryContent = () => (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">購入履歴</h2>
      {purchaseHistory.length === 0 ? (
        <p>購入履歴がありません。</p>
      ) : (
        <div className="space-y-4">
          {purchaseHistory.map((order, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">注文番号: {order.orderId}</h3>
                  <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                </div>
                <div className="space-y-2">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>¥{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>合計</span>
                  <span>¥{order.total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const AdminDashboardContent = () => (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">管理者ダッシュボード</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総収益</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{adminData.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総売上数</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.totalSales}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">アクティブユーザー</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.activeUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">新規顧客</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminData.newCustomers}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>店舗別情報</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>店舗名</TableHead>
                <TableHead>収益</TableHead>
                <TableHead>売上数</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminData.storeInfo.map((store, index) => (
                <TableRow key={index}>
                  <TableCell>{store.name}</TableCell>
                  <TableCell>¥{store.revenue.toLocaleString()}</TableCell>
                  <TableCell>{store.sales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">メニューを開く</span>
          </Button>
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="#" onClick={() => setCurrentPage('main')}>
              <ShoppingCart className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">TechShop</span>
            </a>
          </div>
          <div className="flex flex-1 items-center space-x-2">
            <Input
              type="search"
              placeholder="商品を検索..."
              className="w-full md:w-[300px] lg:w-[400px]"
            />
            <Button type="submit" size="icon" className="shrink-0">
              <Search className="h-4 w-4" />
              <span className="sr-only">検索</span>
            </Button>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                  <span className="sr-only">カートを開く</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>ショッピングカート</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-10rem)] py-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={`/placeholder.svg?height=64&width=64&text=${item.name}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-500">¥{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
                <div className="mt-4">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>合計</span>
                    <span>¥{cartTotal.toLocaleString()}</span>
                  </div>
                  <Button className="w-full mt-4" onClick={handleCheckout}>レジに進む</Button>
                </div>
              </SheetContent>
            </Sheet>
            <Button variant="ghost" size="icon" onClick={() => setCurrentPage('purchaseHistory')}>
              <User className="h-6 w-6" />
              <span className="sr-only">購入履歴</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Switch
                id="admin-mode"
                checked={isAdmin}
                onCheckedChange={toggleAdminMode}
              />
              <Label htmlFor="admin-mode" className="text-sm">
                管理者モード
              </Label>
            </div>
            {isAdmin && (
              <Button variant="ghost" size="icon" onClick={() => setCurrentPage('adminDashboard')}>
                <BarChart className="h-6 w-6" />
                <span className="sr-only">管理者ダッシュボード</span>
              </Button>
            )}
          </div>
        </div>
      </header>
      <div className="flex-1 flex">
        <aside className={`w-64 border-r bg-gray-100 p-4 ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
          <nav className="space-y-2">
            <a href="#" className="block py-2 px-4 rounded hover:bg-gray-200" onClick={() => setCurrentPage('main')}>商品一覧</a>
            <a href="#" className="block py-2 px-4 rounded hover:bg-gray-200" onClick={() => setCurrentPage('purchaseHistory')}>購入履歴</a>
            {isAdmin && (
              <a href="#" className="block py-2 px-4 rounded hover:bg-gray-200" onClick={() => setCurrentPage('adminDashboard')}>管理者ダッシュボード</a>
            )}
            <Separator className="my-4" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedStore} <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => setSelectedStore("全店舗")}>全店舗</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStore("東京")}>東京</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStore("大阪")}>大阪</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStore("名古屋")}>名古屋</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          {currentPage === 'main' && <MainContent />}
          {currentPage === 'productDetail' && <ProductDetailContent />}
          {currentPage === 'checkout' && <CheckoutContent />}
          {currentPage === 'orderComplete' && <OrderCompleteContent />}
          {currentPage === 'purchaseHistory' && <PurchaseHistoryContent />}
          {currentPage === 'adminDashboard' && isAdmin && <AdminDashboardContent />}
        </main>
      </div>
      <footer className="border-t py-6 px-4 md:px-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2023 TechShop Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
