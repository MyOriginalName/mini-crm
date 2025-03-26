export const TASK_STATUS_LABELS = {
  pending: 'В ожидании',
  in_progress: 'В работе',
  completed: 'Завершено'
};

export const TASK_STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800'
};

export const TASK_PRIORITY_LABELS = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий'
};

export const TASK_PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

export const INITIAL_TASK_STATE = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  due_date: '',
  client_id: '',
  deal_id: '',
}; 