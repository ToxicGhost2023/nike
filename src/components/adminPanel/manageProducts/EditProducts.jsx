"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProducts,
  deleteProduct,
  updateProduct,
} from "@/store/Slice/productSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit2, Trash2, Save, X, Package } from "lucide-react";
import { useState } from "react";

export default function EditProducts() {
  const dispatch = useDispatch();
  const { products, loading, pagination } = useSelector(
    (state) => state.products
  );

  const [editProduct, setEditProduct] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(getAllProducts({ page: 1, limit: 50 }));
  }, [dispatch]);

  const openEdit = (product) => {
    setEditProduct({ ...product });
    setIsEditOpen(true);
  };

  const openDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete?._id) return;
    await dispatch(deleteProduct(productToDelete._id));
    setIsDeleteOpen(false);
    setProductToDelete(null);
  };

  const handleSave = async () => {
    if (!editProduct?._id) return;

    const formData = new FormData();
    formData.append("title", editProduct.title || "");
    formData.append("model", editProduct.model || "");

    editProduct.variants?.forEach((v, i) => {
      formData.append(`variants[${i}][price]`, v.price || 0);
      formData.append(`variants[${i}][stock]`, v.stock || 0);
      formData.append(`variants[${i}][discount]`, v.discount || 0);
    });

    await dispatch(updateProduct({ productId: editProduct._id, formData }));
    setIsEditOpen(false);
    setEditProduct(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <p className="text-muted-foreground">
          Total: {pagination.total} products
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Colors</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const variant = product.variants?.[0] || {};
              const price = variant.finalPrice ?? variant.price ?? 0;
              const hasDiscount = variant.discount > 0;

              return (
                <TableRow key={product._id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="w-16 h-16 rounded overflow-hidden border">
                      <img
                        src={product.mainImage || "/placeholder.jpg"}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.title || "—"}
                  </TableCell>
                  <TableCell>{product.model || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${price}</span>
                      {hasDiscount && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${variant.price}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={variant.stock > 0 ? "default" : "destructive"}
                    >
                      {variant.stock || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {(product.availableColors || [])
                        .slice(0, 5)
                        .map((color, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: color.toLowerCase() }}
                            title={color}
                          />
                        ))}
                      {product.availableColors?.length > 5 && (
                        <span className="text-xs text-muted-foreground">
                          +{product.availableColors.length - 5}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {hasDiscount ? (
                      <Badge variant="destructive">-{variant.discount}%</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => openEdit(product)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDelete(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* فرم ویرایش */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product: {editProduct?.title}</DialogTitle>
          </DialogHeader>
          {editProduct && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={editProduct.title || ""}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Model</Label>
                  <Input
                    value={editProduct.model || ""}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, model: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label className="text-lg font-semibold">Variants</Label>
                <div className="space-y-4 mt-3">
                  {(editProduct.variants || []).map((v, i) => (
                    <div key={i} className="border rounded-lg p-4 bg-muted/30">
                      <p className="font-medium text-primary mb-3">
                        {v.color} - Size {v.size}
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Price</Label>
                          <Input
                            type="number"
                            value={v.price || 0}
                            onChange={(e) => {
                              const newVariants = [...editProduct.variants];
                              newVariants[i].price =
                                Number(e.target.value) || 0;
                              setEditProduct({
                                ...editProduct,
                                variants: newVariants,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <Label>Stock</Label>
                          <Input
                            type="number"
                            value={v.stock || 0}
                            onChange={(e) => {
                              const newVariants = [...editProduct.variants];
                              newVariants[i].stock =
                                Number(e.target.value) || 0;
                              setEditProduct({
                                ...editProduct,
                                variants: newVariants,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <Label>Discount (%)</Label>
                          <Input
                            type="number"
                            value={v.discount || 0}
                            onChange={(e) => {
                              const newVariants = [...editProduct.variants];
                              newVariants[i].discount =
                                Number(e.target.value) || 0;
                              setEditProduct({
                                ...editProduct,
                                variants: newVariants,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* تأیید حذف */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{productToDelete?.title}</strong>?
              <br />
              This action <strong>cannot be undone</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
