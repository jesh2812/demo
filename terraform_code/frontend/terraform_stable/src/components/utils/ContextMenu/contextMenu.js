import {memo} from 'react';
import './contextMenu.css'

const ContextMenu = memo(({ isOpen, position, actions = [], onMouseLeave }) => {
    const menuStyle = {
      position: 'absolute',
      left: `${position.x}px`,
      top: `${position.y}px`,
      zIndex: 2000,
      border: 'solid 1px #ccc',
      borderRadius: '6px',
      backgroundColor: 'white',
      padding: 8,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    };
    const buttonStyle = {
      textAlign: 'left',
      padding: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      backgroundColor: 'white',
      ':hover': {
        backgroundColor: '#eee',
      },
    };
    return isOpen ? (
      <div style={menuStyle} onMouseLeave={onMouseLeave}>
        {actions.map((action) => (
          <button key={action.label} onClick={action.effect} className='contextMenuElement' style={buttonStyle}>
            {action.label}
          </button>
        ))}
      </div>
    ) : null;
  });
  
export default ContextMenu;