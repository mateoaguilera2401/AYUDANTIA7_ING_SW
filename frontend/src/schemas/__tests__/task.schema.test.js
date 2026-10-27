import { describe, it, expect } from 'vitest';
import { createTaskSchema, updateTaskSchema } from '../task.schema';

describe('Pruebas unitarias: createTaskSchema (Zod)', () => {
  it('debe validar correctamente cuando los datos son validos', () => {
    const validData = {
      title: 'Estudiar para el certamen',
      description: 'Repasar React Hook Form y esquemas Zod',
    };
    const result = createTaskSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('debe permitir crear una tarea sin descripcion (campo opcional)', () => {
    const validDataWithoutDescription = { title: 'Comprar cuaderno' };
    const result = createTaskSchema.safeParse(validDataWithoutDescription);
    expect(result.success).toBe(true);
  });

  it('debe rechazar la tarea si el titulo esta vacio', () => {
    const invalidData = { title: '' };
    const result = createTaskSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('debe rechazar la tarea si el titulo tiene menos de 3 caracteres', () => {
    const invalidData = { title: 'AB' };
    const result = createTaskSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('debe rechazar la tarea si el titulo supera los 150 caracteres', () => {
    const invalidData = { title: 'A'.repeat(151) };
    const result = createTaskSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('debe rechazar la tarea si la descripcion supera los 500 caracteres', () => {
    const invalidData = {
      title: 'Tarea',
      description: 'X'.repeat(501),
    };
    const result = createTaskSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

// Para la edición de tareas (updateTaskSchema)
describe('Pruebas unitarias: updateTaskSchema (Zod)', () => {
  it('Caso exitoso: debe aceptar datos correctos', () => {
    const validData = {
      title: 'Comprar ron',
      description: 'Abastecer el barco',
      completed: false,
    };
    const result = updateTaskSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('Caso campo opcional: debe aceptar omitir la descripcion o el campo completed', () => {
    const validDataWithoutOptionals = {
      title: 'Limpiar cubierta',
    };
    const result = updateTaskSchema.safeParse(validDataWithoutOptionals);
    expect(result.success).toBe(true);
  });

  it('Caso titulo muy corto: debe rechazar un titulo de menos de 3 caracteres', () => {
    const invalidData = { title: 'AB', completed: true };
    const result = updateTaskSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const titleError = result.error.issues.find((i) => i.path.includes('title'));
      expect(titleError.message).toBe('El título debe tener al menos 3 caracteres');
    }
  });

  it('Caso longitud maxima: debe rechazar un titulo mayor a 150 caracteres', () => {
    const longTitle = 'A'.repeat(151);
    const invalidData = { title: longTitle };
    const result = updateTaskSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});