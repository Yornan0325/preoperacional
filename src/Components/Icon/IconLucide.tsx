import React from "react";
import {
  Truck,
  ShoppingCart,
  UserPen,
  ChartNoAxesGantt,
  FileCheck2,
  Menu,
  Package,
  Star,
  Search,
  BotOff,
  DollarSignIcon,
  DollarSign,
  Layers,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Minus,
  Eye,
  Users,
  ChartNoAxesCombined,
  FileText,
  X,
  Calendar,
  User,
  Folder,
  Wifi,
  WifiOff,
  Printer,
  TriangleAlert,
  Info,
  LogOut,
  Home,
  Settings,
  Trash,
  ScanLine,
  Bell,
  EyeOff,
  BluetoothOff,
  Bluetooth,
  Bolt,
  Target,
  MoreVertical,
  ArrowRightLeft,
  EllipsisVertical,
  Signature,
  Percent,
  Boxes,
  Pencil,
  CheckCircle,
  FileQuestion,
  ArrowRight,
  Form,
  ClipboardCheck,
  PenTool,
  AlertCircle,
  CalendarX,
  ShieldCheck,
} from "lucide-react";

type IconName =
  | "truck"
  | "chevronDown"
  | "chevronUp"
  | "dollarSignIcon"
  | "signature"
  | "signature"
  | "fileQuestion"
  | "chevronRight"
  | "target"
  | "star"
  | "chevronLeft"
  | "botOff"
  | "package"
  | "fileCheck2"
  | "chartNoAxesGantt"
  | "chartNoAxesCombined"
  | "shoppingCart"
  | "menu"
  | "search"
  | "scanLine"
  | "plus"
  | "eye"
  | "triangleAlert"
  | "info"
  | "bolt"
  | "userPen"
  | "pencil"
  | "logOut"
  | "users"
  | "fileText"
  | "trash"
  | "calendar"
  | "user"
  | "bluetoothOff"
  | "folder"
  | "wifi"
  | "wifiOff"
  | "home"
  | "settings"
  | "bell"
  | "arrowRightLeft"
  | "printer"
  | "x"
  | "minus"
  | "bluetooth"
  | "eyeOff"
  | "checkCircle"
  | "layers"
  | "dollarSign"
  | "moreVertical"
  | "boxes"
  | "ellipsisVertical"
  | "percent"
  | "arrowRight"
  | "form"
  | "clipboardCheck"
  | "alertCircle"
  | "calendarX"
  | "shieldCheck"
  | "penTool"

const icons: Record<IconName, React.ElementType> = {
  truck: Truck, // Camion
  menu: Menu, // Menu amburguesa
  penTool:PenTool, // Lapiz
  dollarSignIcon: DollarSignIcon, // Peso
  fileQuestion:FileQuestion, // Archivo de pregunta
  signature:Signature, // Firma
  shieldCheck:ShieldCheck, // Escudo con check
  fileCheck2:FileCheck2, // Archivo de check
  chevronDown: ChevronDown, // Flecha abajo
  package: Package, // Paquete
  star: Star, // Estrella
  chevronUp: ChevronUp, // Flecha arriba
  chevronLeft: ChevronLeft, // Flecha izquierda
  chevronRight: ChevronRight, // Flecha derecha
  botOff: BotOff, // Boton apagado
  target: Target, // Target
  chartNoAxesGantt: ChartNoAxesGantt, // Grafico de gantt
  chartNoAxesCombined: ChartNoAxesCombined, // Grafico de combinado
  shoppingCart: ShoppingCart, // Carrito de compras
  search: Search, // Buscar
  arrowRightLeft: ArrowRightLeft, // Flecha derecha e izquierda
  plus: Plus, // Mas
  ellipsisVertical: EllipsisVertical, // Puntos verticales
  triangleAlert:TriangleAlert, // Triangulo de alerta
  scanLine:ScanLine, // Linea de escaneo
  eyeOff: EyeOff, // Ojo apagado
  eye: Eye, // Ojo
  bolt: Bolt, // Rayo
  users: Users, // Usuarios
  fileText: FileText, // Archivo de texto
  logOut: LogOut, // Cerrar sesión
  bluetoothOff: BluetoothOff, // Bluetooth apagado
  calendar: Calendar, // Calendario
  user: User, // Usuario
  folder: Folder, // Carpeta
  wifi: Wifi, // Wifi
  wifiOff: WifiOff, // Wifi apagado
  bluetooth:Bluetooth, // Bluetooth
  info: Info, // Informacion
  x:X, // X
  userPen:UserPen, // Lapiz
  minus:Minus, // Menos
  trash: Trash, // Basura
  checkCircle:CheckCircle, // Check
  home: Home, // Casa
  settings: Settings, // Ajustes
  bell: Bell, // Campana
  printer: Printer, // Impresora
  moreVertical: MoreVertical, // Puntos verticales
  boxes:Boxes, // Cajas
  layers:Layers, // Capas
  dollarSign:DollarSign, // Peso
  percent:Percent, // Porcentaje
  arrowRight:ArrowRight, // Flecha derecha
  form:Form, // Formulario
  clipboardCheck:ClipboardCheck, // Portapapeles con check
  alertCircle:AlertCircle, // Alerta
  calendarX:CalendarX, // Calendario con X
  pencil:Pencil, // Lapiz
};

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
  strokeWidth: number
}

const IconLucide: React.FC<IconProps> = ({ name, size = 20, color = "currentColor", className, strokeWidth }) => {
  const LucideIcon = icons[name];
  return <LucideIcon size={size} color={color} className={className} strokeWidth={strokeWidth} />;
};

export default IconLucide;