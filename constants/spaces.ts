import { Space } from '@/types';

export const MOCK_SPACES: Space[] = [
  // --- ZONA SILENCIOSA (Top Left) ---
  { id: 'd1', name: 'Desk A1', type: 'desk', zone: 'zona_silenciosa', capacity: 1, amenities: ['Monitor', 'WiFi'], pricePerHour: 5, location: { x: 40, y: 40, width: 60, height: 40 }, isActive: true },
  { id: 'd2', name: 'Desk A2', type: 'desk', zone: 'zona_silenciosa', capacity: 1, amenities: ['WiFi'], pricePerHour: 5, location: { x: 110, y: 40, width: 60, height: 40 }, isActive: true },
  { id: 'd3', name: 'Desk A3', type: 'desk', zone: 'zona_silenciosa', capacity: 1, amenities: ['Monitor', 'WiFi'], pricePerHour: 5, location: { x: 180, y: 40, width: 60, height: 40 }, isActive: true },
  
  { id: 'd4', name: 'Desk B1', type: 'desk', zone: 'zona_silenciosa', capacity: 1, amenities: ['Monitor', 'WiFi'], pricePerHour: 5, location: { x: 40, y: 90, width: 60, height: 40 }, isActive: true },
  { id: 'd5', name: 'Desk B2', type: 'desk', zone: 'zona_silenciosa', capacity: 1, amenities: ['WiFi'], pricePerHour: 5, location: { x: 110, y: 90, width: 60, height: 40 }, isActive: true },
  { id: 'd6', name: 'Desk B3', type: 'desk', zone: 'zona_silenciosa', capacity: 1, amenities: ['Monitor', 'WiFi'], pricePerHour: 5, location: { x: 180, y: 90, width: 60, height: 40 }, isActive: true },

  // --- ZONA CREATIVA (Top Right) ---
  { id: 'm1', name: 'Sala Brainstorm', type: 'meeting_room', zone: 'zona_creativa', capacity: 8, amenities: ['Pizarra', 'Projector', 'WC'], pricePerHour: 30, location: { x: 450, y: 40, width: 220, height: 140 }, isActive: true },
  { id: 'm2', name: 'Sala Workshop', type: 'meeting_room', zone: 'zona_creativa', capacity: 12, amenities: ['TV 75"', 'Cámaras 4K', 'WiFi 6'], pricePerHour: 45, location: { x: 450, y: 200, width: 220, height: 160 }, isActive: true },

  // --- ZONA SOCIAL (Bottom Left) ---
  { id: 'd7', name: 'Flex C1', type: 'desk', zone: 'zona_social', capacity: 1, amenities: ['WiFi'], pricePerHour: 4, location: { x: 40, y: 250, width: 60, height: 40 }, isActive: true },
  { id: 'd8', name: 'Flex C2', type: 'desk', zone: 'zona_social', capacity: 1, amenities: ['Monitor', 'WiFi'], pricePerHour: 4, location: { x: 110, y: 250, width: 60, height: 40 }, isActive: true },
  { id: 'd9', name: 'Flex C3', type: 'desk', zone: 'zona_social', capacity: 1, amenities: ['WiFi'], pricePerHour: 4, location: { x: 180, y: 250, width: 60, height: 40 }, isActive: true },

  { id: 'd10', name: 'Flex D1', type: 'desk', zone: 'zona_social', capacity: 1, amenities: ['WiFi'], pricePerHour: 4, location: { x: 40, y: 300, width: 60, height: 40 }, isActive: true },
  { id: 'd11', name: 'Flex D2', type: 'desk', zone: 'zona_social', capacity: 1, amenities: ['WiFi'], pricePerHour: 4, location: { x: 110, y: 300, width: 60, height: 40 }, isActive: true },
  { id: 'd12', name: 'Flex D3', type: 'desk', zone: 'zona_social', capacity: 1, amenities: ['WiFi'], pricePerHour: 4, location: { x: 180, y: 300, width: 60, height: 40 }, isActive: true },

  // --- PRIVATE OFFICES (Bottom Center) ---
  { id: 'o1', name: 'Oficina Elite', type: 'private_office', zone: 'zona_silenciosa', capacity: 4, amenities: ['Cafetera Privada', 'Control AC', 'Seguridad'], pricePerHour: 60, location: { x: 280, y: 40, width: 140, height: 140 }, isActive: true },
  { id: 'o2', name: 'Oficina Startup', type: 'private_office', zone: 'zona_creativa', capacity: 6, amenities: ['Control AC', 'Pizarra'], pricePerHour: 75, location: { x: 280, y: 200, width: 140, height: 160 }, isActive: true },

  // --- PHONE BOOTHS ---
  { id: 'b1', name: 'Box 1', type: 'meeting_room', zone: 'zona_silenciosa', capacity: 1, amenities: ['Cancelación Ruido'], pricePerHour: 8, location: { x: 40, y: 400, width: 50, height: 50 }, isActive: true },
  { id: 'b2', name: 'Box 2', type: 'meeting_room', zone: 'zona_silenciosa', capacity: 1, amenities: ['Cancelación Ruido'], pricePerHour: 8, location: { x: 100, y: 400, width: 50, height: 50 }, isActive: true },
  { id: 'b3', name: 'Box 3', type: 'meeting_room', zone: 'zona_silenciosa', capacity: 1, amenities: ['Cancelación Ruido'], pricePerHour: 8, location: { x: 160, y: 400, width: 50, height: 50 }, isActive: true },
];

