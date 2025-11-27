"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Plus } from "lucide-react";

export default function BrandPage() {
	// Demo initial brands
	const initialBrands = [
		{ id: "1", name: "Apple", slug: "apple", logo: "", description: "Apple Inc." },
		{ id: "2", name: "Samsung", slug: "samsung", logo: "", description: "Samsung Electronics" },
		{ id: "3", name: "Sony", slug: "sony", logo: "", description: "Sony Corporation" },
	];
	const [brands, setBrands] = useState(initialBrands);
	const [modalOpen, setModalOpen] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [viewMode, setViewMode] = useState(false);
	const [selectedBrand, setSelectedBrand] = useState<{
		id: string;
		name: string;
		slug: string;
		logo: string;
		description: string;
	} | null>(null);
	const [form, setForm] = useState({ name: "", slug: "", logo: "", description: "" });

	// Slugify helper
	const slugify = (text: string) =>
		text
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.replace(/^-+|-+$/g, "");

	// Handlers
	const handleAddBrand = () => {
		setForm({ name: "", slug: "", logo: "", description: "" });
		setEditMode(false);
		setViewMode(false);
		setModalOpen(true);
		setSelectedBrand(null);
	};
	const handleEditBrand = (brand: { id: string; name: string; slug: string; logo: string; description: string }) => {
		setForm({ ...brand });
		setEditMode(true);
		setViewMode(false);
		setModalOpen(true);
		setSelectedBrand(brand);
	};
	const handleViewBrand = (brand: { id: string; name: string; slug: string; logo: string; description: string }) => {
		setForm({ ...brand });
		setEditMode(false);
		setViewMode(true);
		setModalOpen(true);
		setSelectedBrand(brand);
	};
	const handleDeleteBrand = (brand: { id: string; name: string; slug: string; logo: string; description: string }) => {
		if (window.confirm("Are you sure you want to delete this brand?")) {
			setBrands(brands.filter((b) => b.id !== brand.id));
		}
	};
	const handleSaveBrand = () => {
		if (editMode && selectedBrand) {
			setBrands(brands.map((b) => (b.id === selectedBrand.id ? { ...b, ...form } : b)));
		} else {
			setBrands([
				...brands,
				{
					id: Date.now().toString(),
					...form,
					slug: slugify(form.name),
				},
			]);
		}
		setModalOpen(false);
	};
	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value, slug: name === "name" ? slugify(value) : prev.slug }));
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold tracking-tight">Brands</h1>
				<Button onClick={handleAddBrand} className="gap-2">
					<Plus className="h-4 w-4" /> Add Brand
				</Button>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Brand List</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-border">
							<thead>
								<tr>
									<th className="px-4 py-2 text-left">Name</th>
									<th className="px-4 py-2 text-left">Slug</th>
									<th className="px-4 py-2 text-left">Description</th>
									<th className="px-4 py-2 text-left">Actions</th>
								</tr>
							</thead>
							<tbody>
								{brands.map((brand) => (
									<tr key={brand.id} className="border-b">
										<td className="px-4 py-2">{brand.name}</td>
										<td className="px-4 py-2">{brand.slug}</td>
										<td className="px-4 py-2">{brand.description}</td>
										<td className="px-4 py-2">
											<div className="flex gap-2">
												<Button size="sm" variant="outline" onClick={() => handleViewBrand(brand)}>View</Button>
												<Button size="sm" variant="outline" onClick={() => handleEditBrand(brand)}>Edit</Button>
												<Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDeleteBrand(brand)}>Delete</Button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{brands.length === 0 && (
							<div className="text-center text-muted-foreground py-8">No brands found.</div>
						)}
					</div>
				</CardContent>
			</Card>
			{/* Add/Edit/View Brand Modal */}
			<Dialog open={modalOpen} onOpenChange={setModalOpen}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>
							{viewMode ? "View Brand" : editMode ? "Edit Brand" : "Add Brand"}
						</DialogTitle>
						<DialogDescription>
							{viewMode
								? "View brand details."
								: editMode
								? "Edit the selected brand."
								: "Add a new brand."}
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={e => {
							e.preventDefault();
							if (!viewMode) handleSaveBrand();
						}}
						className="space-y-4 py-2"
					>
						<div className="space-y-2">
							<Label htmlFor="name">Brand Name</Label>
							<Input
								id="name"
								name="name"
								value={form.name}
								onChange={handleFormChange}
								disabled={viewMode}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="slug">Slug</Label>
							<Input
								id="slug"
								name="slug"
								value={form.slug}
								onChange={handleFormChange}
								disabled={viewMode}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								name="description"
								value={form.description}
								onChange={handleFormChange}
								disabled={viewMode}
								rows={3}
							/>
						</div>
						<div className="flex justify-end gap-2 mt-4">
							<Button
								type="button"
								className="px-4 py-2 border rounded"
								onClick={() => setModalOpen(false)}
							>
								{viewMode ? "Close" : "Cancel"}
							</Button>
							{!viewMode && (
								<Button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
									{editMode ? "Save Changes" : "Add Brand"}
								</Button>
							)}
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
