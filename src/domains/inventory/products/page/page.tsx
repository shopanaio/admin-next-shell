"use client";

import { useState, useMemo } from "react";
import { Tag, Image, Typography, Flex } from "antd";
import { ColumnsType } from "antd/es/table";
import { TableLayout } from "@/layouts/table/components/TableLayout";
import { UiFilter } from "@/entity/UiFilter";
import { useUiFilters } from "@/components/filters/UiFilterWidget";
import { useDrawersStore, DrawerTypes } from "@/layouts/drawers";

interface IProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: "active" | "draft" | "archived";
  category: string;
  image: string;
}

const mockProducts: IProduct[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    sku: "APL-IPH15PM-256",
    price: 1199,
    stock: 45,
    status: "active",
    category: "Electronics",
    image: "https://picsum.photos/seed/1/40/40",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    sku: "SAM-GS24U-512",
    price: 1299,
    stock: 32,
    status: "active",
    category: "Electronics",
    image: "https://picsum.photos/seed/2/40/40",
  },
  {
    id: "3",
    name: "MacBook Pro 16",
    sku: "APL-MBP16-M3",
    price: 2499,
    stock: 18,
    status: "active",
    category: "Computers",
    image: "https://picsum.photos/seed/3/40/40",
  },
  {
    id: "4",
    name: "Sony WH-1000XM5",
    sku: "SNY-WH1000XM5",
    price: 399,
    stock: 0,
    status: "archived",
    category: "Audio",
    image: "https://picsum.photos/seed/4/40/40",
  },
  {
    id: "5",
    name: "iPad Air M2",
    sku: "APL-IPADAIR-M2",
    price: 799,
    stock: 56,
    status: "active",
    category: "Electronics",
    image: "https://picsum.photos/seed/5/40/40",
  },
  {
    id: "6",
    name: "Dell XPS 15",
    sku: "DEL-XPS15-I7",
    price: 1899,
    stock: 12,
    status: "active",
    category: "Computers",
    image: "https://picsum.photos/seed/6/40/40",
  },
  {
    id: "7",
    name: "AirPods Pro 2",
    sku: "APL-APP2-USB",
    price: 249,
    stock: 89,
    status: "active",
    category: "Audio",
    image: "https://picsum.photos/seed/7/40/40",
  },
  {
    id: "8",
    name: "Google Pixel 8 Pro",
    sku: "GOO-PX8P-256",
    price: 999,
    stock: 5,
    status: "draft",
    category: "Electronics",
    image: "https://picsum.photos/seed/8/40/40",
  },
  {
    id: "9",
    name: "Nintendo Switch OLED",
    sku: "NTD-SWOLED-WHT",
    price: 349,
    stock: 27,
    status: "active",
    category: "Gaming",
    image: "https://picsum.photos/seed/9/40/40",
  },
  {
    id: "10",
    name: "Logitech MX Master 3S",
    sku: "LOG-MXM3S-BLK",
    price: 99,
    stock: 143,
    status: "active",
    category: "Accessories",
    image: "https://picsum.photos/seed/10/40/40",
  },
];

const statusColors: Record<IProduct["status"], string> = {
  active: "green",
  draft: "orange",
  archived: "default",
};

const columns: ColumnsType<IProduct> = [
  {
    title: "Product",
    dataIndex: "name",
    key: "name",
    render: (name: string, record) => (
      <Flex align="center" gap="small">
        <Image
          src={record.image}
          alt={name}
          width={40}
          height={40}
          style={{ borderRadius: 4 }}
          preview={false}
        />
        <Flex vertical>
          <Typography.Text strong>{name}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {record.sku}
          </Typography.Text>
        </Flex>
      </Flex>
    ),
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    width: 140,
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    width: 120,
    render: (price: number) => `$${price.toLocaleString()}`,
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Stock",
    dataIndex: "stock",
    key: "stock",
    width: 100,
    render: (stock: number) => (
      <Typography.Text type={stock === 0 ? "danger" : undefined}>
        {stock}
      </Typography.Text>
    ),
    sorter: (a, b) => a.stock - b.stock,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 100,
    render: (status: IProduct["status"]) => (
      <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
    ),
  },
];

const filterOptions: UiFilter.IUiFilter[] = [
  {
    key: "status",
    label: "Status",
    description: "Filter by product status",
    type: UiFilter.UiFilterType.IsConstant,
    operators: [UiFilter.UiFilterOperator.In],
    payloadKey: "status",
    options: [
      { label: "Active", value: "active" },
      { label: "Draft", value: "draft" },
      { label: "Archived", value: "archived" },
    ],
  },
  {
    key: "category",
    label: "Category",
    description: "Filter by category",
    type: UiFilter.UiFilterType.IsConstant,
    operators: [UiFilter.UiFilterOperator.In],
    payloadKey: "category",
    options: [
      { label: "Electronics", value: "Electronics" },
      { label: "Computers", value: "Computers" },
      { label: "Audio", value: "Audio" },
      { label: "Gaming", value: "Gaming" },
      { label: "Accessories", value: "Accessories" },
    ],
  },
  {
    key: "price",
    label: "Price",
    description: "Filter by price",
    type: UiFilter.UiFilterType.Number,
    operators: UiFilter.uiNumberFilterOperators,
    payloadKey: "price",
  },
  {
    key: "stock",
    label: "Stock",
    description: "Filter by stock quantity",
    type: UiFilter.UiFilterType.Number,
    operators: UiFilter.uiNumberFilterOperators,
    payloadKey: "stock",
  },
  {
    key: "name",
    label: "Name",
    description: "Filter by product name",
    type: UiFilter.UiFilterType.String,
    operators: UiFilter.uiStringFilterOperators,
    payloadKey: "name",
  },
];

export default function ProductsPage() {
  const [selectedRows, setSelectedRows] = useState<IProduct[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const filtersProps = useUiFilters({ filters: filterOptions });
  const addDrawer = useDrawersStore((state) => state.addDrawer);

  const filteredProducts = useMemo(() => {
    let result = mockProducts;

    // Apply search
    if (searchValue) {
      const search = searchValue.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.sku.toLowerCase().includes(search)
      );
    }

    // Apply filters
    filtersProps.value.forEach((filter) => {
      const key = filter.payloadKey as keyof IProduct;
      const { operator, value } = filter;

      if (!value || (Array.isArray(value) && value.length === 0)) return;

      result = result.filter((product) => {
        const productValue = product[key];

        switch (operator) {
          case UiFilter.UiFilterOperator.In:
            return value.includes(productValue);
          case UiFilter.UiFilterOperator.Eq:
            return productValue === value[0];
          case UiFilter.UiFilterOperator.Gt:
            return (productValue as number) > value[0];
          case UiFilter.UiFilterOperator.Gte:
            return (productValue as number) >= value[0];
          case UiFilter.UiFilterOperator.Lt:
            return (productValue as number) < value[0];
          case UiFilter.UiFilterOperator.Lte:
            return (productValue as number) <= value[0];
          case UiFilter.UiFilterOperator.ILike:
            return String(productValue)
              .toLowerCase()
              .includes(String(value[0]).toLowerCase());
          default:
            return true;
        }
      });
    });

    return result;
  }, [searchValue, filtersProps.value]);

  const handleCreate = () => {
    console.log("Create new product");
  };

  const handleRowClick = (record: IProduct) => {
    addDrawer({
      type: DrawerTypes.PRODUCT,
      entityId: record.id,
    });
  };

  const handleDelete = (rows: IProduct[]) => {
    console.log("Delete products:", rows);
  };

  const handleArchive = (rows: IProduct[]) => {
    console.log("Archive products:", rows);
  };

  return (
    <TableLayout<IProduct>
      name="products"
      headerProps={{
        title: "Products",
        count: filteredProducts.length,
        create: handleCreate,
        createLabel: "Add Product",
      }}
      navigationProps={{
        filtersProps,
        searchProps: {
          searchValue,
          onChangeSearchValue: setSearchValue,
        },
        selectedRowsProps: {
          selectedRows,
          onChangeSelectedRows: setSelectedRows,
          clearSelectedRows: () => setSelectedRows([]),
        },
        actionsProps: {
          onDelete: handleDelete,
          onArchive: handleArchive,
        },
      }}
      tableProps={{
        name: "products",
        data: filteredProducts,
        columns,
        onRow: handleRowClick,
        selectedRows,
        onChangeSelectedRows: setSelectedRows,
      }}
      paginationProps={{
        page: 1,
        pageSize: 10,
        total: filteredProducts.length,
        onChangePage: (page) => {
          console.log("Page changed:", page);
        },
      }}
    />
  );
}
