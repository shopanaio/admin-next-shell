"use client";

import { useState, useMemo } from "react";
import { Tag, Image, Typography, Flex, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { DataLayout } from "@/layouts/data";
import { DataTable } from "@/layouts/table/components/Table";
import { TablePagination } from "@/layouts/table/components/Pagination";
import { Actions } from "@/layouts/table/components/Navigation/Actions";
import {
  TableTopBorder,
  TableBottomBorder,
} from "@/layouts/table/components/TableBorders";
import {
  useFilters,
  FilterType,
  FilterOperator,
  FilterWidget,
  numberOperators,
  stringOperators,
  enumOperators,
  type IFilterSchema,
  type IFilterValue,
} from "@/layouts/filters";
import { useDrawer } from "@/layouts/drawers";

// Import types for type-safe drawer payload
import "../drawers/types";

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

const productNames = [
  "iPhone 15 Pro Max",
  "Samsung Galaxy S24 Ultra",
  "MacBook Pro 16",
  "Sony WH-1000XM5",
  "iPad Air M2",
  "Dell XPS 15",
  "AirPods Pro 2",
  "Google Pixel 8 Pro",
  "Nintendo Switch OLED",
  "Logitech MX Master 3S",
  "Sony PlayStation 5",
  "Xbox Series X",
  "LG OLED TV 55",
  "Bose QuietComfort 45",
  "Canon EOS R5",
  "DJI Mavic 3 Pro",
  "Apple Watch Ultra 2",
  "Samsung Galaxy Watch 6",
  "Razer BlackWidow V4",
  "SteelSeries Arctis Nova",
  "ASUS ROG Strix",
  "MSI Titan GT77",
  "Lenovo ThinkPad X1",
  "HP Spectre x360",
  "Acer Predator Helios",
  "Corsair K100 RGB",
  "Elgato Stream Deck",
  "Blue Yeti X",
  "Shure SM7B",
  "Rode NT1",
  "Wacom Cintiq Pro",
  "Huion Kamvas 24",
  "BenQ PD3220U",
  "LG UltraGear 27",
  "Samsung Odyssey G9",
  "Secretlab Titan",
  "Herman Miller Aeron",
  "Dyson V15 Detect",
  "iRobot Roomba j7",
  "Sonos Arc",
  "KEF LS50 Meta",
  "Sennheiser HD 800S",
  "Focal Clear MG",
  "Anker PowerCore",
  "Belkin MagSafe",
  "CalDigit TS4",
  "OWC Thunderbay",
  "Synology DS923+",
  "QNAP TS-464",
  "Ubiquiti Dream Machine",
];

const categories = ["Electronics", "Computers", "Audio", "Gaming", "Accessories"];
const statuses: IProduct["status"][] = ["active", "draft", "archived"];

const mockProducts: IProduct[] = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  name: productNames[i % productNames.length],
  sku: `SKU-${String(i + 1).padStart(4, "0")}`,
  price: Math.floor(Math.random() * 2000) + 99,
  stock: Math.floor(Math.random() * 150),
  status: statuses[i % 10 === 0 ? 2 : i % 7 === 0 ? 1 : 0],
  category: categories[i % categories.length],
  image: `https://picsum.photos/seed/${i + 1}/40/40`,
}));

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

const filterSchema: IFilterSchema[] = [
  {
    key: "status",
    label: "Status",
    description: "Filter by product status",
    type: FilterType.Enum,
    operators: enumOperators,
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
    type: FilterType.Enum,
    operators: enumOperators,
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
    type: FilterType.Number,
    operators: numberOperators,
    payloadKey: "price",
  },
  {
    key: "stock",
    label: "Stock",
    description: "Filter by stock quantity",
    type: FilterType.Number,
    operators: numberOperators,
    payloadKey: "stock",
  },
  {
    key: "name",
    label: "Name",
    description: "Filter by product name",
    type: FilterType.String,
    operators: stringOperators,
    payloadKey: "name",
  },
];

/**
 * Apply filters to data (client-side filtering)
 * This is a simple implementation - in real app, you'd use an adapter for API
 */
function applyFiltersToData(
  data: IProduct[],
  filters: IFilterValue[],
  searchValue: string
): IProduct[] {
  let result = data;

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
  filters.forEach((filter) => {
    const key = filter.payloadKey as keyof IProduct;
    const { operator, value } = filter;

    if (!value || (Array.isArray(value) && value.length === 0)) return;

    result = result.filter((product) => {
      const productValue = product[key];

      switch (operator) {
        case FilterOperator.In:
          return (value as unknown[]).includes(productValue);
        case FilterOperator.Eq:
          return productValue === (value as unknown[])[0];
        case FilterOperator.Gt:
          return (productValue as number) > (value as number[])[0];
        case FilterOperator.Gte:
          return (productValue as number) >= (value as number[])[0];
        case FilterOperator.Lt:
          return (productValue as number) < (value as number[])[0];
        case FilterOperator.Lte:
          return (productValue as number) <= (value as number[])[0];
        case FilterOperator.ILike:
          return String(productValue)
            .toLowerCase()
            .includes(String((value as unknown[])[0]).toLowerCase());
        default:
          return true;
      }
    });
  });

  return result;
}

export default function ProductsPage() {
  const [selectedRows, setSelectedRows] = useState<IProduct[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { filters, widgetProps } = useFilters({ schema: filterSchema });

  // New typed drawer hook
  const openProductDrawer = useDrawer("product");

  const filteredProducts = useMemo(() => {
    return applyFiltersToData(mockProducts, filters, searchValue);
  }, [searchValue, filters]);

  const handleCreate = () => {
    console.log("Create new product");
  };

  const handleRowClick = (record: IProduct) => {
    // Type-safe: payload is typed as ProductDrawerPayload
    openProductDrawer({ entityId: record.id });
  };

  const handleDelete = (rows: IProduct[]) => {
    console.log("Delete products:", rows);
  };

  const handleArchive = (rows: IProduct[]) => {
    console.log("Archive products:", rows);
  };

  const clearSelectedRows = () => setSelectedRows([]);

  return (
    <DataLayout
      name="products"
      title="Products"
      count={filteredProducts.length}
      actions={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Add Product
        </Button>
      }
    >
      <DataLayout.Toolbar
        left={
          <>
            {selectedRows.length > 0 && (
              <Actions
                selectedRows={selectedRows}
                clearSelectedRows={clearSelectedRows}
                onDelete={handleDelete}
                onArchive={handleArchive}
              />
            )}
            <FilterWidget
              {...widgetProps}
              searchProps={{
                searchValue,
                onChangeSearchValue: setSearchValue,
              }}
            />
          </>
        }
      />

      <TableTopBorder />
      <div
        style={{
          backgroundColor: "var(--color-gray-1)",
          borderLeft: "1px solid var(--color-border)",
          borderRight: "1px solid var(--color-border)",
        }}
      >
        <DataTable
          name="products"
          data={filteredProducts}
          columns={columns}
          onRow={handleRowClick}
          selectedRows={selectedRows}
          onChangeSelectedRows={setSelectedRows}
        />
      </div>
      <TableBottomBorder />

      <DataLayout.Footer>
        <TablePagination
          page={page}
          pageSize={pageSize}
          total={filteredProducts.length}
          onChangePage={setPage}
          onChangePageSize={setPageSize}
        />
      </DataLayout.Footer>
    </DataLayout>
  );
}
