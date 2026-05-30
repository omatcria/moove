export default function InputTexto({ placeholder, valor, onChange, type = 'text', submitOnEnter = false, onSubmit }) {
  return (
    <div className="mt-4">
      <input
        type={type}
        value={valor || ''}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { 
          if (e.key === 'Enter' && submitOnEnter && onSubmit) {
            onSubmit();
          }
        }}
        placeholder={placeholder}
        className="input-base w-full text-lg"
        autoFocus
      />
    </div>
  );
}
