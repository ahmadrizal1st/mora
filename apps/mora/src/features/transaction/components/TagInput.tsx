import React, { useState } from 'react';
import { Tag as TagComponent, Icon, Button } from '@/shared/components/ui';
import { useTags, useCreateTag } from '../hooks/useLookups';

interface TagInputProps {
  selectedTagIds: number[];
  onChange: (tagIds: number[]) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ selectedTagIds, onChange }) => {
  const { data: tags = [] } = useTags();
  const createTagMutation = useCreateTag();
  const [newTagName, setNewTagName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleToggleTag = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      const newTag = await createTagMutation.mutateAsync({ 
        name: newTagName, 
        color: '#206bc4' // Default color
      });
      onChange([...selectedTagIds, newTag.id]);
      setNewTagName('');
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to create tag:', error);
    }
  };

  return (
    <div className="tag-input">
      <div className="d-flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <TagComponent
            key={tag.id}
            color={tag.color}
            rounded
            active={selectedTagIds.includes(tag.id)}
            style={{ cursor: 'pointer' }}
            onClick={() => handleToggleTag(tag.id)}
          >
            {tag.name}
          </TagComponent>
        ))}
      </div>
      
      {!isAdding ? (
        <Button 
          outline 
          color="secondary" 
          size="sm" 
          onClick={() => setIsAdding(true)}
          className="btn-icon"
        >
          <Icon icon="plus" size={16} className="me-1" />
          Tag Baru
        </Button>
      ) : (
        <div className="input-group input-group-sm" style={{ maxWidth: '250px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Nama tag..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
            autoFocus
          />
          <Button 
            color="primary" 
            onClick={handleCreateTag}
            loading={createTagMutation.isPending}
          >
            Tambah
          </Button>
          <Button 
            link 
            className="text-muted" 
            onClick={() => setIsAdding(false)}
          >
            Batal
          </Button>
        </div>
      )}
    </div>
  );
};
