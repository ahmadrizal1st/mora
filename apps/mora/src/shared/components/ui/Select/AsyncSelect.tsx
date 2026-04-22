import React from 'react';
import AsyncSelectBase from 'react-select/async';
import { type StylesConfig } from 'react-select';

interface AsyncSelectProps {
  loadOptions: (inputValue: string) => Promise<any[]>;
  onChange: (value: any) => void;
  value?: any;
  placeholder?: string;
  isClearable?: boolean;
}

export const AsyncSelect: React.FC<AsyncSelectProps> = ({
  loadOptions,
  onChange,
  value,
  placeholder = 'Cari...',
  isClearable = true,
}) => {
  // Styling agar sesuai dengan Tabler
  const customStyles: StylesConfig<any, false> = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#206bc4' : '#dadcde',
      boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(32, 107, 196, 0.25)' : 'none',
      '&:hover': {
        borderColor: '#206bc4',
      },
      borderRadius: '4px',
      minHeight: '38px',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#206bc4' : state.isFocused ? '#f1f5f9' : 'white',
      color: state.isSelected ? 'white' : '#1d273b',
      cursor: 'pointer',
    }),
  };

  return (
    <AsyncSelectBase
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      isClearable={isClearable}
      styles={customStyles}
      noOptionsMessage={() => 'Data tidak ditemukan'}
      loadingMessage={() => 'Mencari...'}
    />
  );
};
