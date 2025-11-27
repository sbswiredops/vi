'use client'

import { useState } from "react"
import Image from "next/image"
import { Plus, Edit, Trash2, MoreVertical, GripVertical } from "lucide-react"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog"

interface HeroImage {
  id: string;
  image: string;
}

const initialHeroImages: HeroImage[] = [
  { id: "1", image: "/iphone-banner-electronics-sale.jpg" },
  { id: "2", image: "/flash-sale-electronics-discount.jpg" },
  { id: "3", image: "/macbook-laptop-promotional-banner.jpg" },
]

export default function BannersPage() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>(initialHeroImages);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<HeroImage | null>(null);
  const [editImageData, setEditImageData] = useState<HeroImage | null>(null);

  const handleEditClick = (img: HeroImage) => {
    setSelectedImage(img);
    setEditImageData({ ...img });
    setEditOpen(true);
  };

  const handleDeleteClick = (img: HeroImage) => {
    setSelectedImage(img);
    setDeleteOpen(true);
  };

  const handleSaveEdit = () => {
    if (editImageData) {
      setHeroImages(heroImages.map((img) => (img.id === editImageData.id ? editImageData : img)));
      setEditOpen(false);
      setEditImageData(null);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedImage) {
      setHeroImages(heroImages.filter((img) => img.id !== selectedImage.id));
      setDeleteOpen(false);
      setSelectedImage(null);
    }
  };

  // Multiple image upload handler
  const handleHeroImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: HeroImage[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push({ id: String(Date.now()) + Math.random(), image: event.target!.result as string });
          if (newImages.length === files.length) {
            setHeroImages((prev) => [...prev, ...newImages]);
            setIsUploadDialogOpen(false);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hero Section Images</h1>
          <p className="text-muted-foreground">Manage homepage hero section images (slider).</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Upload Images
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload Hero Images</DialogTitle>
            </DialogHeader>
            <form className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Images</Label>
                <Input type="file" accept="image/*" multiple onChange={handleHeroImagesUpload} />
                <p className="text-xs text-muted-foreground">Upload one or more images (1920×600 recommended)</p>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {heroImages.map((img) => (
              <div key={img.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
                <div className="cursor-grab text-muted-foreground">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="h-20 w-40 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={img.image || "/placeholder.svg"}
                    alt="Hero Image"
                    width={160}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(img)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(img)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Hero Image Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Hero Image</DialogTitle>
            <DialogDescription>Update hero image</DialogDescription>
          </DialogHeader>
          {editImageData && (
            <form className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Hero Image</Label>
                <div className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted">
                  <Image
                    src={editImageData.image || "/placeholder.svg"}
                    alt="Hero Image"
                    width={300}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        setEditImageData((prev) => prev ? { ...prev, image: event.target!.result as string } : prev);
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                <p className="text-xs text-muted-foreground">Click to change image (1920×600 recommended)</p>
              </div>
            </form>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Delete Hero Image Modal */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hero Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this hero image? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
