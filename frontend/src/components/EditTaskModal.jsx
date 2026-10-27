import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateTaskSchema } from '../schemas/task.schema';
import tasksService from '../services/tasks.service';

export function EditTaskModal({ task, onTaskUpdated, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || '',
      completed: task.completed,
    },
  });

  const onSubmit = async (data) => {
    try {
      const updatedTask = await tasksService.update(task.id, data);
      if (onTaskUpdated) onTaskUpdated(updatedTask);
      if (onClose) onClose();
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 p-6 rounded-lg w-full max-w-md text-white">
        <h2 className="text-xl font-bold mb-4">Editar Tarea</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Título de la tarea *</label>
            <input 
              type="text" 
              {...register('title')} 
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500"
            />
            {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Descripción</label>
            <textarea 
              {...register('description')} 
              className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500"
            />
            {errors.description && <p className="text-rose-400 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              {...register('completed')} 
              id="completed"
              className="w-4 h-4 rounded bg-slate-700 border-slate-600 focus:ring-blue-500"
            />
            <label htmlFor="completed" className="text-sm">Completada</label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded text-sm transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Actualizar Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}