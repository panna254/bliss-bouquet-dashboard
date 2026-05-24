import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(price);

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, getCartTotal } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Cart | Bliss Bouquet Kenya" description="Review your Bliss Bouquet cart." />
      <Header />
      <main className="container py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold">Your Cart</h1>
            <p className="mt-1 text-sm text-muted-foreground">Review your flowers and gifts before checkout.</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <h2 className="font-medium">Your cart is empty</h2>
            <p className="mt-1 text-sm text-muted-foreground">Add an arrangement to begin checkout.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {items.map((item) => (
                <article key={item.id} className="flex gap-4 rounded-lg border p-4">
                  <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-medium">{item.name}</h2>
                    <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}>-</Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeFromCart(item.id)}>Remove</Button>
                    </div>
                  </div>
                  <div className="text-right text-sm font-semibold">{formatPrice(item.price * item.quantity)}</div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total</span>
                <span className="font-heading text-xl font-semibold text-primary">{formatPrice(getCartTotal())}</span>
              </div>
              <Button className="mt-4 w-full" onClick={() => navigate("/checkout")}>Checkout</Button>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
