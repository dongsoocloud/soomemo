import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// SortableCategoryItem 컴포넌트
const SortableCategoryItem = ({ category, isSelected, onSelect, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors relative group ${
        isSelected 
          ? 'bg-blue-100 border border-blue-300' 
          : 'hover:bg-gray-50'
      }`}
      onClick={() => onSelect(category.id)}
    >
      <div
        {...attributes}
        {...listeners}
        className="mr-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        ⋮⋮
      </div>
      <span 
        className="w-3 h-3 rounded-full mr-3 flex-shrink-0" 
        style={{ backgroundColor: category.color }}
      ></span>
      <span className="text-sm text-gray-700 flex-1">{category.name}</span>
      {category.id !== 'default' && (
        <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
          <button 
            className="bg-blue-100 hover:bg-blue-200 text-blue-600 rounded p-1 text-xs transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(category.id);
            }}
          >
            ✏️
          </button>
          <button 
            className="bg-red-100 hover:bg-red-200 text-red-600 rounded p-1 text-xs transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(category.id);
            }}
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

const CategorySidebar = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  onAddCategory,
  onReorderCategories, 
  onUpdateCategory, 
  onDeleteCategory 
}) => {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#007bff');
  const [editingCategory, setEditingCategory] = useState(null);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim(), newCategoryColor);
      setNewCategoryName('');
      setNewCategoryColor('#007bff');
      setIsAddingCategory(false);
    }
  };

  const handleUpdateCategory = (id, name, color) => {
    onUpdateCategory(id, name, color);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('이 분류를 삭제하시겠습니까? 해당 분류의 메모들은 기본 분류로 이동됩니다.')) {
      onDeleteCategory(id);
    }
  };

  const colorOptions = [
    '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8',
    '#6f42c1', '#e83e8c', '#fd7e14', '#20c997', '#6c757d'
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = categories.findIndex(category => category.id === active.id);
      const newIndex = categories.findIndex(category => category.id === over.id);
      
      const newCategories = arrayMove(categories, oldIndex, newIndex);
      onReorderCategories(newCategories.map(cat => cat.id));
    }
  };

  return (
    <div className="w-72 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 flex flex-col h-fit max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center p-6 border-b border-gray-100/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">📁</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800">분류</h3>
        </div>
        <button 
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl w-10 h-10 flex items-center justify-center text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
          onClick={() => setIsAddingCategory(true)}
        >
          +
        </button>
      </div>

      <div className="p-4">
        <div 
          className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 mb-2 group ${
            selectedCategory === 'all' 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105' 
              : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md hover:transform hover:scale-102'
          }`}
          onClick={() => onCategorySelect('all')}
        >
          <div className="w-4 h-4 rounded-full mr-4 flex-shrink-0 bg-white/20 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-white"></span>
          </div>
          <span className="text-sm font-medium">전체</span>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={categories.map(cat => cat.id)} strategy={verticalListSortingStrategy}>
            {categories.map(category => (
              <div key={category.id} className="mb-1">
                {editingCategory === category.id ? (
              <div className="p-3 bg-gray-50 rounded-lg mb-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm mb-2 focus:outline-none focus:border-blue-500"
                  placeholder="분류명"
                  autoFocus
                />
                <div className="flex gap-1 mb-2 flex-wrap">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      className={`w-5 h-5 rounded-full border-2 transition-all ${
                        newCategoryColor === color 
                          ? 'border-gray-800 scale-110' 
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewCategoryColor(color)}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button 
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                    onClick={() => handleUpdateCategory(category.id, newCategoryName, newCategoryColor)}
                  >
                    저장
                  </button>
                  <button 
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs transition-colors"
                    onClick={() => {
                      setEditingCategory(null);
                      setNewCategoryName('');
                    }}
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <SortableCategoryItem
                category={category}
                isSelected={selectedCategory === category.id}
                onSelect={onCategorySelect}
                onEdit={(id) => {
                  setEditingCategory(id);
                  setNewCategoryName(category.name);
                  setNewCategoryColor(category.color);
                }}
                onDelete={handleDeleteCategory}
              />
            )}
          </div>
        ))}
          </SortableContext>
        </DndContext>

        {isAddingCategory && (
          <div className="p-3 bg-gray-50 rounded-lg mb-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm mb-2 focus:outline-none focus:border-blue-500"
              placeholder="분류명을 입력하세요"
              autoFocus
            />
            <div className="flex gap-1 mb-2 flex-wrap">
              {colorOptions.map(color => (
                <button
                  key={color}
                  className={`w-5 h-5 rounded-full border-2 transition-all ${
                    newCategoryColor === color 
                      ? 'border-gray-800 scale-110' 
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewCategoryColor(color)}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button 
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                onClick={handleAddCategory}
              >
                추가
              </button>
              <button 
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs transition-colors"
                onClick={() => {
                  setIsAddingCategory(false);
                  setNewCategoryName('');
                }}
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySidebar;
