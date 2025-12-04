/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {useState, useEffect} from 'react';
import productsService from '../../../lib/api/services/products';
import categoriesService from '../../../lib/api/services/categories';
import brandsService from '../../../lib/api/services/brands';
import Link from 'next/link';
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  GripVertical,
  Image as ImageIcon,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import {Button} from '../../../components/ui/button';
import {Input} from '../../../components/ui/input';
import {Label} from '../../../components/ui/label';
import {Textarea} from '../../../components/ui/textarea';
import {Switch} from '../../../components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {withProtectedRoute} from '../../../lib/auth/protected-route';

function NewProductPage() {
  // Basic product info
  const [productName, setProductName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [productCode, setProductCode] = useState('');
  const [sku, setSku] = useState('');
  const [warranty, setWarranty] = useState('');

  // Category and Brand
  const [categories, setCategories] = useState<{id: string; name: string}[]>(
    [],
  );
  const [brands, setBrands] = useState<{id: string; name: string}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');

  // Status flags
  const [isActive, setIsActive] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isPos, setIsPos] = useState(true);
  const [isPreOrder, setIsPreOrder] = useState(false);
  const [isOfficial, setIsOfficial] = useState(false);
  const [freeShipping, setFreeShipping] = useState(false);
  const [isEmi, setIsEmi] = useState(false);

  // Reward & Booking
  const [rewardPoints, setRewardPoints] = useState('');
  const [minBookingPrice, setMinBookingPrice] = useState('');

  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [seoCanonical, setSeoCanonical] = useState('');
  const [tags, setTags] = useState('');

  // FAQ IDs
  const [faqIds, setFaqIds] = useState('');

  // Base Price (for products with network adjustments)
  const [basePrice, setBasePrice] = useState('');
  const [baseComparePrice, setBaseComparePrice] = useState('');

  // Networks → Colors → Storages → Prices
  const [networks, setNetworks] = useState<
    Array<{
      id: string;
      networkName: string;
      priceAdjustment: string;
      isDefault: boolean;
      colors: Array<{
        id: string;
        colorName: string;
        colorImage: string;
        hasStorage: boolean;
        singlePrice: string;
        singleComparePrice: string;
        singleStockQuantity: string;
        features: string;
        storages: Array<{
          id: string;
          storageSize: string;
          regularPrice: string;
          comparePrice: string;
          discountPrice: string;
          discountPercent: string;
          campaignPrice: string;
          campaignStart: string;
          campaignEnd: string;
          stockQuantity: string;
          lowStockAlert: string;
        }>;
      }>;
    }>
  >([]);

  // File uploads
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<
    Array<{
      url: string;
      isThumbnail: boolean;
      altText: string;
      file: File;
    }>
  >([]);
  const [colorImageFiles, setColorImageFiles] = useState<File[]>([]);
  const [colorImagePreviews, setColorImagePreviews] = useState<
    Array<{
      url: string;
      name: string;
      file: File;
    }>
  >([]);

  // Videos
  const [videos, setVideos] = useState<
    Array<{
      id: string;
      url: string;
      type: string;
    }>
  >([{id: 'video-1', url: '', type: 'youtube'}]);

  // Regions → Colors → Storages → Prices
  const [regions, setRegions] = useState<
    Array<{
      id: string;
      regionName: string;
      isDefault: boolean;
      colors: Array<{
        id: string;
        colorName: string;
        colorImage: string;
        hasStorage: boolean;
        singlePrice: string;
        singleComparePrice: string;
        singleStockQuantity: string;
        features: string;
        storages: Array<{
          id: string;
          storageSize: string;
          regularPrice: string;
          comparePrice: string;
          discountPrice: string;
          discountPercent: string;
          campaignPrice: string;
          campaignStart: string;
          campaignEnd: string;
          stockQuantity: string;
          lowStockAlert: string;
        }>;
      }>;
    }>
  >([
    {
      id: 'region-1',
      regionName: 'International',
      isDefault: true,
      colors: [
        {
          id: 'color-1',
          colorName: 'Midnight',
          colorImage: '',
          hasStorage: true,
          singlePrice: '',
          singleComparePrice: '',
          singleStockQuantity: '',
          features: '',
          storages: [
            {
              id: 'storage-1',
              storageSize: '256GB',
              regularPrice: '',
              comparePrice: '',
              discountPrice: '',
              discountPercent: '',
              campaignPrice: '',
              campaignStart: '',
              campaignEnd: '',
              stockQuantity: '',
              lowStockAlert: '5',
            },
          ],
        },
      ],
    },
  ]);

  // Specifications (grouped)
  const [specificationGroups, setSpecificationGroups] = useState<
    Array<{
      id: string;
      groupName: string;
      icon: string;
      specs: Array<{
        id: string;
        key: string;
        value: string;
      }>;
    }>
  >([
    {
      id: 'group-1',
      groupName: 'Display',
      icon: 'display-icon',
      specs: [{id: 'spec-1', key: 'Screen Size', value: ''}],
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories and brands
  useEffect(() => {
    categoriesService.getAll().then(data => {
      setCategories(
        data.map((c: any) => ({
          id: c.id,
          name: c.name,
        })),
      );
    });
    brandsService.findAll().then(data => {
      setBrands(data.map((b: any) => ({id: b.id, name: b.name})));
    });
  }, []);

  // Slugify helper
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setProductName(newName);
    setSlug(prevSlug => {
      const prevAuto = slugify(productName);
      const newAuto = slugify(newName);
      if (prevSlug === prevAuto || prevSlug === '') {
        return newAuto;
      }
      return prevSlug;
    });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(slugify(e.target.value));
  };

  // Network management
  const addNetwork = () => {
    setNetworks([
      ...networks,
      {
        id: `network-${Date.now()}`,
        networkName: '',
        priceAdjustment: '0',
        isDefault: false,
        colors: [
          {
            id: `color-${Date.now()}`,
            colorName: '',
            colorImage: '',
            hasStorage: true,
            singlePrice: '',
            singleComparePrice: '',
            singleStockQuantity: '',
            features: '',
            storages: [
              {
                id: `storage-${Date.now()}`,
                storageSize: '',
                regularPrice: '',
                comparePrice: '',
                discountPrice: '',
                discountPercent: '',
                campaignPrice: '',
                campaignStart: '',
                campaignEnd: '',
                stockQuantity: '',
                lowStockAlert: '5',
              },
            ],
          },
        ],
      },
    ]);
  };

  const removeNetwork = (networkId: string) => {
    setNetworks(networks.filter(n => n.id !== networkId));
  };

  const updateNetwork = (networkId: string, field: string, value: any) => {
    setNetworks(
      networks.map(n => (n.id === networkId ? {...n, [field]: value} : n)),
    );
  };

  // Color management within network
  const addColorToNetwork = (networkId: string) => {
    setNetworks(
      networks.map(n =>
        n.id === networkId
          ? {
              ...n,
              colors: [
                ...n.colors,
                {
                  id: `color-${Date.now()}`,
                  colorName: '',
                  colorImage: '',
                  hasStorage: true,
                  singlePrice: '',
                  singleComparePrice: '',
                  singleStockQuantity: '',
                  features: '',
                  storages: [
                    {
                      id: `storage-${Date.now()}`,
                      storageSize: '',
                      regularPrice: '',
                      comparePrice: '',
                      discountPrice: '',
                      discountPercent: '',
                      campaignPrice: '',
                      campaignStart: '',
                      campaignEnd: '',
                      stockQuantity: '',
                      lowStockAlert: '5',
                    },
                  ],
                },
              ],
            }
          : n,
      ),
    );
  };

  const removeColorFromNetwork = (networkId: string, colorId: string) => {
    setNetworks(
      networks.map(n =>
        n.id === networkId
          ? {...n, colors: n.colors.filter(c => c.id !== colorId)}
          : n,
      ),
    );
  };

  const updateColorInNetwork = (
    networkId: string,
    colorId: string,
    field: string,
    value: any,
  ) => {
    setNetworks(
      networks.map(n =>
        n.id === networkId
          ? {
              ...n,
              colors: n.colors.map(c =>
                c.id === colorId ? {...c, [field]: value} : c,
              ),
            }
          : n,
      ),
    );
  };

  // Storage management within network color
  const addStorageToNetwork = (networkId: string, colorId: string) => {
    setNetworks(
      networks.map(n =>
        n.id === networkId
          ? {
              ...n,
              colors: n.colors.map(c =>
                c.id === colorId
                  ? {
                      ...c,
                      storages: [
                        ...c.storages,
                        {
                          id: `storage-${Date.now()}`,
                          storageSize: '',
                          regularPrice: '',
                          comparePrice: '',
                          discountPrice: '',
                          discountPercent: '',
                          campaignPrice: '',
                          campaignStart: '',
                          campaignEnd: '',
                          stockQuantity: '',
                          lowStockAlert: '5',
                        },
                      ],
                    }
                  : c,
              ),
            }
          : n,
      ),
    );
  };

  const removeStorageFromNetwork = (
    networkId: string,
    colorId: string,
    storageId: string,
  ) => {
    setNetworks(
      networks.map(n =>
        n.id === networkId
          ? {
              ...n,
              colors: n.colors.map(c =>
                c.id === colorId
                  ? {
                      ...c,
                      storages: c.storages.filter(s => s.id !== storageId),
                    }
                  : c,
              ),
            }
          : n,
      ),
    );
  };

  const updateStorageInNetwork = (
    networkId: string,
    colorId: string,
    storageId: string,
    field: string,
    value: any,
  ) => {
    setNetworks(
      networks.map(n =>
        n.id === networkId
          ? {
              ...n,
              colors: n.colors.map(c =>
                c.id === colorId
                  ? {
                      ...c,
                      storages: c.storages.map(s =>
                        s.id === storageId ? {...s, [field]: value} : s,
                      ),
                    }
                  : c,
              ),
            }
          : n,
      ),
    );
  };

  // Region management
  const addRegion = () => {
    setRegions([
      ...regions,
      {
        id: `region-${Date.now()}`,
        regionName: '',
        isDefault: false,
        colors: [
          {
            id: `color-${Date.now()}`,
            colorName: '',
            colorImage: '',
            hasStorage: true,
            singlePrice: '',
            singleComparePrice: '',
            singleStockQuantity: '',
            features: '',
            storages: [
              {
                id: `storage-${Date.now()}`,
                storageSize: '',
                regularPrice: '',
                comparePrice: '',
                discountPrice: '',
                discountPercent: '',
                campaignPrice: '',
                campaignStart: '',
                campaignEnd: '',
                stockQuantity: '',
                lowStockAlert: '5',
              },
            ],
          },
        ],
      },
    ]);
  };

  const removeRegion = (regionId: string) => {
    setRegions(regions.filter(r => r.id !== regionId));
  };

  const updateRegion = (regionId: string, field: string, value: any) => {
    setRegions(
      regions.map(r => (r.id === regionId ? {...r, [field]: value} : r)),
    );
  };

  // Color management within region
  const addColor = (regionId: string) => {
    setRegions(
      regions.map(r =>
        r.id === regionId
          ? {
              ...r,
              colors: [
                ...r.colors,
                {
                  id: `color-${Date.now()}`,
                  colorName: '',
                  colorImage: '',
                  hasStorage: true,
                  singlePrice: '',
                  singleComparePrice: '',
                  singleStockQuantity: '',
                  features: '',
                  storages: [
                    {
                      id: `storage-${Date.now()}`,
                      storageSize: '',
                      regularPrice: '',
                      comparePrice: '',
                      discountPrice: '',
                      discountPercent: '',
                      campaignPrice: '',
                      campaignStart: '',
                      campaignEnd: '',
                      stockQuantity: '',
                      lowStockAlert: '5',
                    },
                  ],
                },
              ],
            }
          : r,
      ),
    );
  };

  const removeColor = (regionId: string, colorId: string) => {
    setRegions(
      regions.map(r =>
        r.id === regionId
          ? {...r, colors: r.colors.filter(c => c.id !== colorId)}
          : r,
      ),
    );
  };

  const updateColor = (
    regionId: string,
    colorId: string,
    field: string,
    value: any,
  ) => {
    setRegions(
      regions.map(r =>
        r.id === regionId
          ? {
              ...r,
              colors: r.colors.map(c =>
                c.id === colorId ? {...c, [field]: value} : c,
              ),
            }
          : r,
      ),
    );
  };

  // Storage management within color
  const addStorage = (regionId: string, colorId: string) => {
    setRegions(
      regions.map(r =>
        r.id === regionId
          ? {
              ...r,
              colors: r.colors.map(c =>
                c.id === colorId
                  ? {
                      ...c,
                      storages: [
                        ...c.storages,
                        {
                          id: `storage-${Date.now()}`,
                          storageSize: '',
                          regularPrice: '',
                          comparePrice: '',
                          discountPrice: '',
                          discountPercent: '',
                          campaignPrice: '',
                          campaignStart: '',
                          campaignEnd: '',
                          stockQuantity: '',
                          lowStockAlert: '5',
                        },
                      ],
                    }
                  : c,
              ),
            }
          : r,
      ),
    );
  };

  const removeStorage = (
    regionId: string,
    colorId: string,
    storageId: string,
  ) => {
    setRegions(
      regions.map(r =>
        r.id === regionId
          ? {
              ...r,
              colors: r.colors.map(c =>
                c.id === colorId
                  ? {
                      ...c,
                      storages: c.storages.filter(s => s.id !== storageId),
                    }
                  : c,
              ),
            }
          : r,
      ),
    );
  };

  const updateStorage = (
    regionId: string,
    colorId: string,
    storageId: string,
    field: string,
    value: any,
  ) => {
    setRegions(
      regions.map(r =>
        r.id === regionId
          ? {
              ...r,
              colors: r.colors.map(c =>
                c.id === colorId
                  ? {
                      ...c,
                      storages: c.storages.map(s =>
                        s.id === storageId ? {...s, [field]: value} : s,
                      ),
                    }
                  : c,
              ),
            }
          : r,
      ),
    );
  };

  // Product Image management
  const handleProductImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      const newPreviews = files.map((file, idx) => ({
        url: URL.createObjectURL(file),
        isThumbnail: imagePreviews.length === 0 && idx === 0,
        altText: productName || file.name,
        file,
      }));

      setImageFiles([...imageFiles, ...files]);
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const removeProductImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const toggleThumbnail = (index: number) => {
    setImagePreviews(
      imagePreviews.map((img, i) => ({
        ...img,
        isThumbnail: i === index,
      })),
    );
  };

  // Color Image management
  const handleColorImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      const newPreviews = files.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        file,
      }));

      setColorImageFiles([...colorImageFiles, ...files]);
      setColorImagePreviews([...colorImagePreviews, ...newPreviews]);
    }
  };

  const removeColorImage = (index: number) => {
    setColorImageFiles(colorImageFiles.filter((_, i) => i !== index));
    setColorImagePreviews(colorImagePreviews.filter((_, i) => i !== index));
  };

  // Video management
  const addVideo = () => {
    setVideos([
      ...videos,
      {id: `video-${Date.now()}`, url: '', type: 'youtube'},
    ]);
  };

  const removeVideo = (id: string) => {
    setVideos(videos.filter(v => v.id !== id));
  };

  const updateVideo = (id: string, field: string, value: string) => {
    setVideos(videos.map(v => (v.id === id ? {...v, [field]: value} : v)));
  };

  // Specification group management
  const addSpecGroup = () => {
    setSpecificationGroups([
      ...specificationGroups,
      {
        id: `group-${Date.now()}`,
        groupName: '',
        icon: '',
        specs: [{id: `spec-${Date.now()}`, key: '', value: ''}],
      },
    ]);
  };

  const removeSpecGroup = (groupId: string) => {
    setSpecificationGroups(specificationGroups.filter(g => g.id !== groupId));
  };

  const updateSpecGroup = (groupId: string, field: string, value: any) => {
    setSpecificationGroups(
      specificationGroups.map(g =>
        g.id === groupId ? {...g, [field]: value} : g,
      ),
    );
  };

  const addSpecToGroup = (groupId: string) => {
    setSpecificationGroups(
      specificationGroups.map(g =>
        g.id === groupId
          ? {
              ...g,
              specs: [
                ...g.specs,
                {id: `spec-${Date.now()}`, key: '', value: ''},
              ],
            }
          : g,
      ),
    );
  };

  const removeSpecFromGroup = (groupId: string, specId: string) => {
    setSpecificationGroups(
      specificationGroups.map(g =>
        g.id === groupId
          ? {...g, specs: g.specs.filter(s => s.id !== specId)}
          : g,
      ),
    );
  };

  const updateSpec = (
    groupId: string,
    specId: string,
    field: string,
    value: string,
  ) => {
    setSpecificationGroups(
      specificationGroups.map(g =>
        g.id === groupId
          ? {
              ...g,
              specs: g.specs.map(s =>
                s.id === specId ? {...s, [field]: value} : s,
              ),
            }
          : g,
      ),
    );
  };

  // Handle publish product with FormData
  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append product image files
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      // Append color image files
      colorImageFiles.forEach(file => {
        formData.append('colorImages', file);
      });

      // Prepare JSON payload
      const payload: any = {
        name: productName,
        slug,
        description: description || undefined,
        categoryId: selectedCategory || undefined,
        brandId: selectedBrand || undefined,
        productCode: productCode || undefined,
        sku: sku || undefined,
        warranty: warranty || undefined,
        isActive,
        isOnline,
        isPos,
        isPreOrder,
        isOfficial,
        freeShipping,
        isEmi,
        rewardPoints: rewardPoints ? Number(rewardPoints) : undefined,
        minBookingPrice: minBookingPrice ? Number(minBookingPrice) : undefined,
        basePrice: basePrice ? Number(basePrice) : undefined,
        baseComparePrice: baseComparePrice ? Number(baseComparePrice) : undefined,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        seoKeywords: seoKeywords
          ? seoKeywords.split(',').map(k => k.trim())
          : undefined,
        seoCanonical: seoCanonical || undefined,
        tags: tags ? tags.split(',').map(t => t.trim()) : undefined,
        faqIds: faqIds ? faqIds.split(',').map(id => id.trim()) : undefined,

        // Networks with nested colors, storages, and prices
        networks: networks.length > 0 ? networks.map((network, nIdx) => ({
          networkName: network.networkName,
          priceAdjustment: network.priceAdjustment ? Number(network.priceAdjustment) : 0,
          isDefault: network.isDefault,
          displayOrder: nIdx,
          colors: network.colors.map((color, cIdx) => ({
            colorName: color.colorName,
            hasStorage: color.hasStorage,
            singlePrice:
              !color.hasStorage && color.singlePrice
                ? Number(color.singlePrice)
                : undefined,
            singleComparePrice:
              !color.hasStorage && color.singleComparePrice
                ? Number(color.singleComparePrice)
                : undefined,
            singleStockQuantity:
              !color.hasStorage && color.singleStockQuantity
                ? Number(color.singleStockQuantity)
                : undefined,
            features: color.features
              ? color.features.split(',').map(f => f.trim())
              : undefined,
            displayOrder: cIdx,
            storages: color.hasStorage
              ? color.storages.map((storage, sIdx) => ({
                  storageSize: storage.storageSize,
                  displayOrder: sIdx,
                  price: {
                    regularPrice: storage.regularPrice
                      ? Number(storage.regularPrice)
                      : 0,
                    comparePrice: storage.comparePrice
                      ? Number(storage.comparePrice)
                      : undefined,
                    discountPrice: storage.discountPrice
                      ? Number(storage.discountPrice)
                      : undefined,
                    discountPercent: storage.discountPercent
                      ? Number(storage.discountPercent)
                      : undefined,
                    campaignPrice: storage.campaignPrice
                      ? Number(storage.campaignPrice)
                      : undefined,
                    campaignStart: storage.campaignStart || undefined,
                    campaignEnd: storage.campaignEnd || undefined,
                    stockQuantity: storage.stockQuantity
                      ? Number(storage.stockQuantity)
                      : 0,
                    lowStockAlert: storage.lowStockAlert
                      ? Number(storage.lowStockAlert)
                      : 5,
                  },
                }))
              : undefined,
          })),
        })) : undefined,

        // Regions with nested colors, storages, and prices (color images will be assigned by backend)
        regions: regions.length > 0 ? regions.map((region, rIdx) => ({
          regionName: region.regionName,
          isDefault: region.isDefault,
          displayOrder: rIdx,
          colors: region.colors.map((color, cIdx) => ({
            colorName: color.colorName,
            // colorImage will be auto-assigned by backend from uploaded colorImages
            hasStorage: color.hasStorage,
            singlePrice:
              !color.hasStorage && color.singlePrice
                ? Number(color.singlePrice)
                : undefined,
            singleComparePrice:
              !color.hasStorage && color.singleComparePrice
                ? Number(color.singleComparePrice)
                : undefined,
            singleStockQuantity:
              !color.hasStorage && color.singleStockQuantity
                ? Number(color.singleStockQuantity)
                : undefined,
            features: color.features
              ? color.features.split(',').map(f => f.trim())
              : undefined,
            displayOrder: cIdx,
            storages: color.hasStorage
              ? color.storages.map((storage, sIdx) => ({
                  storageSize: storage.storageSize,
                  displayOrder: sIdx,
                  price: {
                    regularPrice: storage.regularPrice
                      ? Number(storage.regularPrice)
                      : 0,
                    comparePrice: storage.comparePrice
                      ? Number(storage.comparePrice)
                      : undefined,
                    discountPrice: storage.discountPrice
                      ? Number(storage.discountPrice)
                      : undefined,
                    discountPercent: storage.discountPercent
                      ? Number(storage.discountPercent)
                      : undefined,
                    campaignPrice: storage.campaignPrice
                      ? Number(storage.campaignPrice)
                      : undefined,
                    campaignStart: storage.campaignStart || undefined,
                    campaignEnd: storage.campaignEnd || undefined,
                    stockQuantity: storage.stockQuantity
                      ? Number(storage.stockQuantity)
                      : 0,
                    lowStockAlert: storage.lowStockAlert
                      ? Number(storage.lowStockAlert)
                      : 5,
                  },
                }))
              : undefined,
          })),
        })) : undefined,

        // Videos
        videos: videos
          .filter(v => v.url)
          .map((v, idx) => ({
            videoUrl: v.url,
            videoType: v.type,
            displayOrder: idx,
          })),

        // Specifications (grouped)
        specifications: specificationGroups
          .filter(g => g.groupName && g.specs.some(s => s.key && s.value))
          .map((g, gIdx) => ({
            groupName: g.groupName,
            displayOrder: gIdx,
            icon: g.icon || undefined,
            specs: g.specs
              .filter(s => s.key && s.value)
              .map((s, sIdx) => ({
                specKey: s.key,
                specValue: s.value,
                displayOrder: sIdx,
              })),
          })),
      };

      // Append all JSON fields to FormData
      Object.keys(payload).forEach(key => {
        const value = payload[key];
        if (value !== undefined) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      console.log('Submitting FormData with files...');
      console.log('Product Images:', imageFiles.length);
      console.log('Color Images:', colorImageFiles.length);

      // Call API with FormData
      await productsService.createWithFormData(formData);

      alert('Product created successfully!');
      // Optionally redirect to products list
      // router.push('/admin/products');
    } catch (err: any) {
      console.error('Error creating product:', err);
      alert(
        'Failed to create product: ' +
          (err?.response?.data?.message || err?.message || 'Unknown error'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">
            Create a new product listing with images.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="Enter product name"
                value={productName}
                onChange={handleProductNameChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                placeholder="product-url-slug"
                value={slug}
                onChange={handleSlugChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter product description (Markdown supported)"
                rows={8}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand">Brand</Label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map(brand => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="productCode">Product Code</Label>
                <Input
                  id="productCode"
                  placeholder="Enter product code"
                  value={productCode}
                  onChange={e => setProductCode(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  placeholder="Enter SKU"
                  value={sku}
                  onChange={e => setSku(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="warranty">Warranty</Label>
                <Input
                  id="warranty"
                  placeholder="e.g. 1 Year Official"
                  value={warranty}
                  onChange={e => setWarranty(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Product Status Flags */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Product Status</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="isOnline"
                  checked={isOnline}
                  onCheckedChange={setIsOnline}
                />
                <Label htmlFor="isOnline">Online</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="isPos" checked={isPos} onCheckedChange={setIsPos} />
                <Label htmlFor="isPos">POS</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="isPreOrder"
                  checked={isPreOrder}
                  onCheckedChange={setIsPreOrder}
                />
                <Label htmlFor="isPreOrder">Pre-Order</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="isOfficial"
                  checked={isOfficial}
                  onCheckedChange={setIsOfficial}
                />
                <Label htmlFor="isOfficial">Official</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="freeShipping"
                  checked={freeShipping}
                  onCheckedChange={setFreeShipping}
                />
                <Label htmlFor="freeShipping">Free Shipping</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="isEmi"
                  checked={isEmi}
                  onCheckedChange={setIsEmi}
                />
                <Label htmlFor="isEmi">EMI Available</Label>
              </div>
            </div>
          </div>

          {/* Rewards & Booking */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Rewards & Booking</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="rewardPoints">Reward Points</Label>
                <Input
                  id="rewardPoints"
                  type="number"
                  placeholder="0"
                  value={rewardPoints}
                  onChange={e => setRewardPoints(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minBookingPrice">Min Booking Price</Label>
                <Input
                  id="minBookingPrice"
                  type="number"
                  placeholder="0"
                  value={minBookingPrice}
                  onChange={e => setMinBookingPrice(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Base Price (for network variants) */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Base Price (Optional - for Network Variants)</h2>
            <p className="text-sm text-muted-foreground">
              Set base price if using network variants with price adjustments
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="basePrice">Base Price</Label>
                <Input
                  id="basePrice"
                  type="number"
                  placeholder="0"
                  value={basePrice}
                  onChange={e => setBasePrice(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="baseComparePrice">Base Compare Price</Label>
                <Input
                  id="baseComparePrice"
                  type="number"
                  placeholder="0"
                  value={baseComparePrice}
                  onChange={e => setBaseComparePrice(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Product Images</h2>
            <p className="text-sm text-muted-foreground">
              Upload main product images. Click an image to set as thumbnail.
              Files will be uploaded to Cloudflare.
            </p>
            <div className="grid gap-4 sm:grid-cols-4">
              {imagePreviews.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg border border-border bg-muted">
                  <button
                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground z-10"
                    onClick={() => removeProductImage(index)}>
                    <X className="h-3 w-3" />
                  </button>
                  {image.isThumbnail && (
                    <div className="absolute left-2 top-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs z-10">
                      Thumbnail
                    </div>
                  )}
                  <img
                    src={image.url}
                    alt={image.altText}
                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                    onClick={() => toggleThumbnail(index)}
                  />
                </div>
              ))}
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted">
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Upload</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleProductImageUpload}
                />
              </label>
            </div>
          </div>

          {/* Color Images */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Color Variant Images</h2>
            <p className="text-sm text-muted-foreground">
              Upload images for color variants. These will be automatically
              assigned to colors in order. Upload{' '}
              {networks.reduce((sum, n) => sum + n.colors.length, 0) + 
               regions.reduce((sum, r) => sum + r.colors.length, 0)} images (one
              per color across all networks and regions).
            </p>
            <div className="grid gap-4 sm:grid-cols-6">
              {colorImagePreviews.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg border border-border bg-muted">
                  <button
                    className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground z-10"
                    onClick={() => removeColorImage(index)}>
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute left-1 top-1 bg-black/60 text-white px-1.5 py-0.5 rounded text-xs z-10">
                    #{index + 1}
                  </div>
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:bg-muted">
                <ImageIcon className="mb-2 h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Colors</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleColorImageUpload}
                />
              </label>
            </div>
          </div>

          {/* Networks, Colors, Storages, Prices */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Networks, Colors, Storages & Pricing
              </h2>
              <Button variant="outline" size="sm" onClick={addNetwork}>
                <Plus className="mr-2 h-4 w-4" /> Add Network
              </Button>
            </div>

            {networks.map((network, networkIdx) => (
              <Card key={network.id} className="border-2 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between bg-blue-50">
                  <CardTitle className="text-base">
                    Network #{networkIdx + 1}
                  </CardTitle>
                  {networks.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeNetwork(network.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4 mt-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="grid gap-2">
                      <Label>Network Name *</Label>
                      <Input
                        placeholder="e.g. 4G LTE, 5G, WiFi Only"
                        value={network.networkName}
                        onChange={e =>
                          updateNetwork(network.id, 'networkName', e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Price Adjustment</Label>
                      <Input
                        type="number"
                        placeholder="0 (positive or negative)"
                        value={network.priceAdjustment}
                        onChange={e =>
                          updateNetwork(network.id, 'priceAdjustment', e.target.value)
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-7">
                      <Switch
                        checked={network.isDefault}
                        onCheckedChange={checked =>
                          updateNetwork(network.id, 'isDefault', checked)
                        }
                      />
                      <Label>Default Network</Label>
                    </div>
                  </div>

                  {/* Colors within this network */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold">Colors</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addColorToNetwork(network.id)}>
                        <Plus className="mr-2 h-3 w-3" /> Add Color
                      </Button>
                    </div>

                    {network.colors.map((color, colorIdx) => (
                      <Card key={color.id} className="border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm">
                            Color #{colorIdx + 1}
                          </CardTitle>
                          {network.colors.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeColorFromNetwork(network.id, color.id)}>
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                              <Label>Color Name *</Label>
                              <Input
                                placeholder="e.g. Midnight"
                                value={color.colorName}
                                onChange={e =>
                                  updateColorInNetwork(
                                    network.id,
                                    color.id,
                                    'colorName',
                                    e.target.value,
                                  )
                                }
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>Features (comma separated)</Label>
                              <Input
                                placeholder="e.g. Wireless Charging, 5G"
                                value={color.features}
                                onChange={e =>
                                  updateColorInNetwork(
                                    network.id,
                                    color.id,
                                    'features',
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Switch
                              checked={color.hasStorage}
                              onCheckedChange={checked =>
                                updateColorInNetwork(
                                  network.id,
                                  color.id,
                                  'hasStorage',
                                  checked,
                                )
                              }
                            />
                            <Label>Has Storage Variants</Label>
                          </div>

                          {/* Color-only pricing (when hasStorage = false) */}
                          {!color.hasStorage && (
                            <div className="grid gap-4 sm:grid-cols-3 p-4 bg-muted rounded-lg">
                              <div className="grid gap-2">
                                <Label>Price *</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={color.singlePrice}
                                  onChange={e =>
                                    updateColorInNetwork(
                                      network.id,
                                      color.id,
                                      'singlePrice',
                                      e.target.value,
                                    )
                                  }
                                  required
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label>Compare Price</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={color.singleComparePrice}
                                  onChange={e =>
                                    updateColorInNetwork(
                                      network.id,
                                      color.id,
                                      'singleComparePrice',
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label>Stock Quantity</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={color.singleStockQuantity}
                                  onChange={e =>
                                    updateColorInNetwork(
                                      network.id,
                                      color.id,
                                      'singleStockQuantity',
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                            </div>
                          )}

                          {/* Storages within this color (only if hasStorage = true) */}
                          {color.hasStorage && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="font-semibold">
                                  Storage Variants & Pricing
                                </Label>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    addStorageToNetwork(network.id, color.id)
                                  }>
                                  <Plus className="mr-2 h-3 w-3" /> Add Storage
                                </Button>
                              </div>

                              {color.storages.map((storage, storageIdx) => (
                                <div
                                  key={storage.id}
                                  className="rounded border p-4 space-y-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">
                                      Storage #{storageIdx + 1}
                                    </span>
                                    {color.storages.length > 1 && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          removeStorageFromNetwork(
                                            network.id,
                                            color.id,
                                            storage.id,
                                          )
                                        }>
                                        <X className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>

                                  <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="grid gap-2">
                                      <Label>Storage Size *</Label>
                                      <Input
                                        placeholder="e.g. 256GB"
                                        value={storage.storageSize}
                                        onChange={e =>
                                          updateStorageInNetwork(
                                            network.id,
                                            color.id,
                                            storage.id,
                                            'storageSize',
                                            e.target.value,
                                          )
                                        }
                                        required
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Regular Price *</Label>
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        value={storage.regularPrice}
                                        onChange={e =>
                                          updateStorageInNetwork(
                                            network.id,
                                            color.id,
                                            storage.id,
                                            'regularPrice',
                                            e.target.value,
                                          )
                                        }
                                        required
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Compare Price</Label>
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        value={storage.comparePrice}
                                        onChange={e =>
                                          updateStorageInNetwork(
                                            network.id,
                                            color.id,
                                            storage.id,
                                            'comparePrice',
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="grid gap-2">
                                      <Label>Discount Price</Label>
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        value={storage.discountPrice}
                                        onChange={e =>
                                          updateStorageInNetwork(
                                            network.id,
                                            color.id,
                                            storage.id,
                                            'discountPrice',
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Discount %</Label>
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        value={storage.discountPercent}
                                        onChange={e =>
                                          updateStorageInNetwork(
                                            network.id,
                                            color.id,
                                            storage.id,
                                            'discountPercent',
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Campaign Price</Label>
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        value={storage.campaignPrice}
                                        onChange={e =>
                                          updateStorageInNetwork(
                                            network.id,
                                            color.id,
                                            storage.id,
                                            'campaignPrice',
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                      <Label>Campaign Start</Label>
                                      <Input
                                        type="datetime-local"
                                        value={storage.campaignStart}
                                        onChange={e =>
                                          updateStorageInNetwork(
                                            network.id,
                                            color.id,
                                            storage.id,
                                            'campaignStart',
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Campaign End</Label>
                                      <Input
                                        type="datetime-local"
                                        value={storage.campaignEnd}
                                        onChange={e =>
                                          updateStorageInNetwork(
                                            network.id,
                                            color.id,
                                            storage.id,
                                            'campaignEnd',
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                      <Label>Stock Quantity *</Label>
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        value={storage.stockQuantity}
                                        onChange={e =>
                                          updateStorageInNetwork(
                                            network.id,
                                            color.id,
                                            storage.id,
                                            'stockQuantity',
                                            e.target.value,
                                          )
                                        }
                                        required
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Low Stock Alert</Label>
                                      <Input
                                        type="number"
                                        placeholder="5"
                                        value={storage.lowStockAlert}
                                        onChange={e =>
                                          updateStorageInNetwork(
                                            network.id,
                                            color.id,
                                            storage.id,
                                            'lowStockAlert',
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Regions, Colors, Storages, Prices */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Regions, Colors, Storages & Pricing
              </h2>
              <Button variant="outline" size="sm" onClick={addRegion}>
                <Plus className="mr-2 h-4 w-4" /> Add Region
              </Button>
            </div>

            {regions.map((region, regionIdx) => (
              <Card key={region.id} className="border-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">
                    Region #{regionIdx + 1}
                  </CardTitle>
                  {regions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRegion(region.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>Region Name *</Label>
                      <Input
                        placeholder="e.g. International, USA, Europe"
                        value={region.regionName}
                        onChange={e =>
                          updateRegion(region.id, 'regionName', e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-7">
                      <Switch
                        checked={region.isDefault}
                        onCheckedChange={checked =>
                          updateRegion(region.id, 'isDefault', checked)
                        }
                      />
                      <Label>Default Region</Label>
                    </div>
                  </div>

                  {/* Colors within this region */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold">Colors</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addColor(region.id)}>
                        <Plus className="mr-2 h-3 w-3" /> Add Color
                      </Button>
                    </div>

                    {region.colors.map((color, colorIdx) => (
                      <Card key={color.id} className="border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm">
                            Color #{colorIdx + 1}
                          </CardTitle>
                          {region.colors.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeColor(region.id, color.id)}>
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                              <Label>Color Name *</Label>
                              <Input
                                placeholder="e.g. Midnight"
                                value={color.colorName}
                                onChange={e =>
                                  updateColor(
                                    region.id,
                                    color.id,
                                    'colorName',
                                    e.target.value,
                                  )
                                }
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label>Features (comma separated)</Label>
                              <Input
                                placeholder="e.g. Wireless Charging, 5G"
                                value={color.features}
                                onChange={e =>
                                  updateColor(
                                    region.id,
                                    color.id,
                                    'features',
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Switch
                              checked={color.hasStorage}
                              onCheckedChange={checked =>
                                updateColor(
                                  region.id,
                                  color.id,
                                  'hasStorage',
                                  checked,
                                )
                              }
                            />
                            <Label>Has Storage Variants</Label>
                          </div>

                          {/* Color-only pricing (when hasStorage = false) */}
                          {!color.hasStorage && (
                            <div className="grid gap-4 sm:grid-cols-3 p-4 bg-muted rounded-lg">
                              <div className="grid gap-2">
                                <Label>Price *</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={color.singlePrice}
                                  onChange={e =>
                                    updateColor(
                                      region.id,
                                      color.id,
                                      'singlePrice',
                                      e.target.value,
                                    )
                                  }
                                  required
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label>Compare Price</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={color.singleComparePrice}
                                  onChange={e =>
                                    updateColor(
                                      region.id,
                                      color.id,
                                      'singleComparePrice',
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label>Stock Quantity</Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={color.singleStockQuantity}
                                  onChange={e =>
                                    updateColor(
                                      region.id,
                                      color.id,
                                      'singleStockQuantity',
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                            </div>
                          )}

                          {/* Storages within this color (only if hasStorage = true) */}
                          {color.hasStorage && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="font-semibold">
                                  Storage Variants & Pricing
                                </Label>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    addStorage(region.id, color.id)
                                  }>
                                  <Plus className="mr-2 h-3 w-3" /> Add Storage
                                </Button>
                              </div>

                              {color.storages.map((storage, storageIdx) => (
                                <div
                                  key={storage.id}
                                  className="rounded border p-4 space-y-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">
                                      Storage #{storageIdx + 1}
                                    </span>
                                    {color.storages.length > 1 && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          removeStorage(
                                            region.id,
                                            color.id,
                                            storage.id,
                                          )
                                        }>
                                        <X className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>

                                  <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="grid gap-2">
                                      <Label>Storage Size *</Label>
                                      <Input
                                        placeholder="e.g. 256GB"
                                        value={storage.storageSize}
                                        onChange={e =>
                                          updateStorage(
                                            region.id,
                                            color.id,
                                            storage.id,
                                            'storageSize',
                                            e.target.value,
                                          )
                                        }
                                        required
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Regular Price *</Label>
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        value={storage.regularPrice}
                                        onChange={e =>
                                          updateStorage(
                                            region.id,
                                            color.id,
                                            storage.id,
                                            'regularPrice',
                                            e.target.value,
                                          )
                                        }
                                        required
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Compare Price</Label>
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        value={storage.comparePrice}
                                        onChange={e =>
                                          updateStorage(
                                            region.id,
                                            color.id,
                                            storage.id,
                                            'comparePrice',
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="grid gap-2">
                                      <Label>Discount Price</Label>
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        value={storage.discountPrice}
                                        onChange={e =>
                                          updateStorage(
                                            region.id,
                                            color.id,
                                            storage.id,
                                            'discountPrice',
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Discount %</Label>
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        value={storage.discountPercent}
                                        onChange={e =>
                                          updateStorage(
                                            region.id,
                                            color.id,
                                            storage.id,
                                            'discountPercent',
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Campaign Price</Label>
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        value={storage.campaignPrice}
                                        onChange={e =>
                                          updateStorage(
                                            region.id,
                                            color.id,
                                            storage.id,
                                            'campaignPrice',
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                      <Label>Campaign Start</Label>
                                      <Input
                                        type="datetime-local"
                                        value={storage.campaignStart}
                                        onChange={e =>
                                          updateStorage(
                                            region.id,
                                            color.id,
                                            storage.id,
                                            'campaignStart',
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Campaign End</Label>
                                      <Input
                                        type="datetime-local"
                                        value={storage.campaignEnd}
                                        onChange={e =>
                                          updateStorage(
                                            region.id,
                                            color.id,
                                            storage.id,
                                            'campaignEnd',
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                      <Label>Stock Quantity *</Label>
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        value={storage.stockQuantity}
                                        onChange={e =>
                                          updateStorage(
                                            region.id,
                                            color.id,
                                            storage.id,
                                            'stockQuantity',
                                            e.target.value,
                                          )
                                        }
                                        required
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Low Stock Alert</Label>
                                      <Input
                                        type="number"
                                        placeholder="5"
                                        value={storage.lowStockAlert}
                                        onChange={e =>
                                          updateStorage(
                                            region.id,
                                            color.id,
                                            storage.id,
                                            'lowStockAlert',
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Videos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Product Videos</h2>
              <Button variant="outline" size="sm" onClick={addVideo}>
                <Plus className="mr-2 h-4 w-4" /> Add Video
              </Button>
            </div>
            {videos.map((video, idx) => (
              <div key={video.id} className="flex items-center gap-4">
                <Input
                  placeholder="Video URL (YouTube, Vimeo, etc.)"
                  value={video.url}
                  onChange={e => updateVideo(video.id, 'url', e.target.value)}
                  className="flex-1"
                />
                <Select
                  value={video.type}
                  onValueChange={val => updateVideo(video.id, 'type', val)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="vimeo">Vimeo</SelectItem>
                    <SelectItem value="cloudflare">Cloudflare</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {videos.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVideo(video.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Specifications</h2>
              <Button variant="outline" size="sm" onClick={addSpecGroup}>
                <Plus className="mr-2 h-4 w-4" /> Add Group
              </Button>
            </div>

            {specificationGroups.map((group, groupIdx) => (
              <Card key={group.id} className="border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">
                    Spec Group #{groupIdx + 1}
                  </CardTitle>
                  {specificationGroups.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSpecGroup(group.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>Group Name *</Label>
                      <Input
                        placeholder="e.g. Display, Camera, Battery"
                        value={group.groupName}
                        onChange={e =>
                          updateSpecGroup(group.id, 'groupName', e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Icon (optional)</Label>
                      <Input
                        placeholder="e.g. display-icon"
                        value={group.icon}
                        onChange={e =>
                          updateSpecGroup(group.id, 'icon', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold">Specifications</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addSpecToGroup(group.id)}>
                        <Plus className="mr-2 h-3 w-3" /> Add Spec
                      </Button>
                    </div>

                    {group.specs.map((spec, specIdx) => (
                      <div key={spec.id} className="flex items-center gap-2">
                        <Input
                          placeholder="Key (e.g. Screen Size)"
                          value={spec.key}
                          onChange={e =>
                            updateSpec(group.id, spec.id, 'key', e.target.value)
                          }
                          className="flex-1"
                        />
                        <Input
                          placeholder="Value (e.g. 6.7 inches)"
                          value={spec.value}
                          onChange={e =>
                            updateSpec(
                              group.id,
                              spec.id,
                              'value',
                              e.target.value,
                            )
                          }
                          className="flex-1"
                        />
                        {group.specs.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              removeSpecFromGroup(group.id, spec.id)
                            }>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* SEO Settings */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">SEO Settings</h2>
            <div className="grid gap-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                placeholder="Enter SEO title"
                value={seoTitle}
                onChange={e => setSeoTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                placeholder="Enter SEO description"
                rows={3}
                value={seoDescription}
                onChange={e => setSeoDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="seoKeywords">
                SEO Keywords (comma separated)
              </Label>
              <Input
                id="seoKeywords"
                placeholder="e.g. iphone, apple, smartphone"
                value={seoKeywords}
                onChange={e => setSeoKeywords(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="seoCanonical">Canonical URL</Label>
              <Input
                id="seoCanonical"
                placeholder="https://example.com/product"
                value={seoCanonical}
                onChange={e => setSeoCanonical(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="e.g. flagship, premium, 5G"
                value={tags}
                onChange={e => setTags(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="faqIds">FAQ IDs (comma separated)</Label>
              <Input
                id="faqIds"
                placeholder="e.g. 507f1f77bcf86cd799439011, 507f191e810c19729de860ea"
                value={faqIds}
                onChange={e => setFaqIds(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" disabled={isSubmitting}>
          Save as Draft
        </Button>
        <Button onClick={handlePublish} disabled={isSubmitting}>
          {isSubmitting ? 'Publishing...' : 'Publish Product'}
        </Button>
      </div>
    </div>
  );
}

export default withProtectedRoute(NewProductPage, {
  requiredRoles: ['admin'],
  fallbackTo: '/login',
  showLoader: true,
});
