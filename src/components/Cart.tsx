import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";

export default function Cart({ onClose }: { onClose: () => void }) {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        
        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="w-screen max-w-md">
            <div className="flex h-full flex-col bg-background shadow-xl">
              <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-foreground">Shopping Cart</h2>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      className="-m-2 p-2 text-foreground hover:text-primary"
                      onClick={onClose}
                    >
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flow-root">
                    {items.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">Your cart is empty</p>
                        <Button className="mt-4" onClick={onClose}>
                          Continue Shopping
                        </Button>
                      </div>
                    ) : (
                      <ul className="-my-6 divide-y divide-border">
                        {items.map((item) => (
                          <li key={item.id} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-foreground">
                                  <h3>{item.name}</h3>
                                  <p className="ml-4">{formatCurrency(item.price)}</p>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {item.category}
                                </p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                    className="h-8 w-8 p-0"
                                  >
                                    -
                                  </Button>
                                  <span className="w-8 text-center">{item.quantity}</span>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="h-8 w-8 p-0"
                                  >
                                    +
                                  </Button>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-destructive hover:text-destructive/80"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {items.length > 0 && (
                <div className="border-t border-border bg-muted/20 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-foreground">
                    <p>Subtotal</p>
                    <p>{formatCurrency(getCartTotal())}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6">
                    <Button className="w-full">
                      Checkout
                    </Button>
                  </div>
                  <div className="mt-4 flex justify-center text-center text-sm text-muted-foreground">
                    <p>
                      or{" "}
                      <button
                        type="button"
                        className="font-medium text-primary hover:text-primary/80"
                        onClick={onClose}
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
