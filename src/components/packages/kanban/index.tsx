'use client';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/src/components/ui/shadcn-io/kanban';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';

const columns = [
  { id: 'col-planned-001', name: 'Planned', color: '#6B7280' },
  { id: 'col-progress-002', name: 'In Progress', color: '#F59E0B' },
  { id: 'col-done-003', name: 'Done', color: '#10B981' },
  { id: 'col-blocked-004', name: 'Blocked', color: '#EF4444' }, 
];

const users = [
  {
    id: 'user-001',
    name: 'Alex Johnson',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  {
    id: 'user-002',
    name: 'Sarah Chen',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: 'user-003',
    name: 'Michael Brown',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
  },
  {
    id: 'user-004',
    name: 'Emily Davis',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
  },
];

const exampleFeatures = [
  {
    id: 'feat-001',
    name: 'Implement User Authentication',
    startAt: new Date('2024-01-15'),
    endAt: new Date('2024-02-28'),
    column: 'col-planned-001',
    owner: users[0],
  },
  {
    id: 'feat-002',
    name: 'Design Dashboard Interface',
    startAt: new Date('2024-02-01'),
    endAt: new Date('2024-03-15'),
    column: 'col-progress-002',
    owner: users[1],
  },
  {
    id: 'feat-003',
    name: 'Setup Database Schema',
    startAt: new Date('2023-12-01'),
    endAt: new Date('2024-01-10'),
    column: 'col-done-003',
    owner: users[2],
  },
  {
    id: 'feat-004',
    name: 'Create API Endpoints',
    startAt: new Date('2024-01-20'),
    endAt: new Date('2024-03-01'),
    column: 'col-planned-001',
    owner: users[3],
  },
  {
    id: 'feat-005',
    name: 'Build Notification System',
    startAt: new Date('2024-02-10'),
    endAt: new Date('2024-03-20'),
    column: 'col-progress-002',
    owner: users[0],
  },
  {
    id: 'feat-006',
    name: 'Write Unit Tests',
    startAt: new Date('2023-11-15'),
    endAt: new Date('2023-12-30'),
    column: 'col-done-003',
    owner: users[1],
  },
  {
    id: 'feat-007',
    name: 'Implement Search Functionality',
    startAt: new Date('2024-02-15'),
    endAt: new Date('2024-04-01'),
    column: 'col-planned-001',
    owner: users[2],
  },
  {
    id: 'feat-008',
    name: 'Add File Upload Feature',
    startAt: new Date('2024-02-05'),
    endAt: new Date('2024-03-10'),
    column: 'col-progress-002',
    owner: users[3],
  },
  {
    id: 'feat-009',
    name: 'Setup CI/CD Pipeline',
    startAt: new Date('2023-10-01'),
    endAt: new Date('2023-11-15'),
    column: 'col-done-003',
    owner: users[0],
  },
  {
    id: 'feat-010',
    name: 'Create Admin Panel',
    startAt: new Date('2024-03-01'),
    endAt: new Date('2024-04-15'),
    column: 'col-planned-001',
    owner: users[1],
  },
  {
    id: 'feat-011',
    name: 'Implement Payment Gateway',
    startAt: new Date('2024-02-20'),
    endAt: new Date('2024-04-05'),
    column: 'col-progress-002',
    owner: users[2],
  },
  {
    id: 'feat-012',
    name: 'Build Mobile Responsive Layout',
    startAt: new Date('2023-12-10'),
    endAt: new Date('2024-01-25'),
    column: 'col-done-003',
    owner: users[3],
  },
  {
    id: 'feat-013',
    name: 'Add Dark Mode Support',
    startAt: new Date('2024-03-10'),
    endAt: new Date('2024-04-25'),
    column: 'col-planned-001',
    owner: users[0],
  },
  {
    id: 'feat-014',
    name: 'Implement Real-time Chat',
    startAt: new Date('2024-02-25'),
    endAt: new Date('2024-04-10'),
    column: 'col-progress-002',
    owner: users[1],
  },
  {
    id: 'feat-015',
    name: 'Create Documentation Site',
    startAt: new Date('2023-11-20'),
    endAt: new Date('2024-01-05'),
    column: 'col-done-003',
    owner: users[2],
  },
  {
    id: 'feat-016',
    name: 'Build Analytics Dashboard',
    startAt: new Date('2024-03-15'),
    endAt: new Date('2024-05-01'),
    column: 'col-planned-001',
    owner: users[3],
  },
  {
    id: 'feat-017',
    name: 'Add Multi-language Support',
    startAt: new Date('2024-03-05'),
    endAt: new Date('2024-04-20'),
    column: 'col-progress-002',
    owner: users[0],
  },
  {
    id: 'feat-018',
    name: 'Setup Error Monitoring',
    startAt: new Date('2023-10-15'),
    endAt: new Date('2023-12-01'),
    column: 'col-done-003',
    owner: users[1],
  },
  {
    id: 'feat-019',
    name: 'Implement Caching Layer',
    startAt: new Date('2024-03-20'),
    endAt: new Date('2024-05-05'),
    column: 'col-planned-001',
    owner: users[2],
  },
  {
    id: 'feat-020',
    name: 'Create User Onboarding Flow',
    startAt: new Date('2024-03-12'),
    endAt: new Date('2024-04-28'),
    column: 'col-progress-002',
    owner: users[3],
  },
];

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});
const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

const Kanban = () => {
  const [features, setFeatures] = useState(exampleFeatures);
  return (
    <KanbanProvider
      columns={columns}
      data={features}
      onDataChange={setFeatures}
    >
      {(column) => (
        <KanbanBoard id={column.id} key={column.id}>
          <KanbanHeader>
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: column.color }}
              />
              <span>{column.name}</span>
            </div>
          </KanbanHeader>
          <KanbanCards id={column.id}>
            {(feature: (typeof features)[number]) => (
              <KanbanCard
                column={column.id}
                id={feature.id}
                key={feature.id}
                name={feature.name}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="m-0 flex-1 font-medium text-sm">
                      {feature.name}
                    </p>
                  </div>
                  {feature.owner && (
                    <Avatar className="h-4 w-4 shrink-0">
                      <AvatarImage src={feature.owner.image} />
                      <AvatarFallback>
                        {feature.owner.name?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <p className="m-0 text-muted-foreground text-xs">
                  {shortDateFormatter.format(feature.startAt)} -{' '}
                  {dateFormatter.format(feature.endAt)}
                </p>
              </KanbanCard>
            )}
          </KanbanCards>
        </KanbanBoard>
      )}
    </KanbanProvider>
  );
};
export default Kanban;