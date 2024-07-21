import AES from 'crypto-js/aes';
import utf8 from 'crypto-js/enc-utf8';
import { useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';

const secret = 'secret';

export class Window {
  id: string;
  url: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;

  constructor(url: string) {
    this.id = crypto.randomUUID();
    this.url = url;
  }
}

export function useWindows() {
  const match = useMatch('/:encKey');
  const navigate = useNavigate();

  const stack = (match?.params.encKey?.length
    ? JSON.parse(AES.decrypt(decodeURIComponent(match?.params.encKey), secret).toString(utf8))
    : []) as Array<Window>;

  const [editing, setEditing] = useState(false);

  const setStack = (stack: Array<Window>) => {
    const encrypted = stack.length ? AES.encrypt(JSON.stringify(stack), secret).toString() : '';
    navigate(`/${encodeURIComponent(encrypted)}`);
  };

  const create = (window: Partial<Window>) => setStack([...stack, { ...new Window(''), ...window }]);
  const update = (id: Window['id'], params: Partial<Window>) => setStack(stack.map((window) => window.id === id ? ({ ...window, ...params }) : window));
  const remove = (id: Window['id']) => setStack(stack.filter((window) => window.id !== id));
  const removeAll = () => setStack([]);
  const putOnTop = (id: Window['id']) => {
    if (stack.findIndex((window) => window.id === id) === -1) return;
    if (stack.length === 1) return;
    if (stack.findIndex((window) => window.id === id) === stack.length - 1) return;
    setStack(stack.sort((a, b) => a.id === id ? 1 : b.id === id ? -1 : 0));
  };
  const toggleEditing = () => setEditing(!editing);
  const stopEditing = () => setEditing(false);

  return {
    stack,
    editing,
    create,
    update,
    remove,
    removeAll,
    putOnTop,
    toggleEditing,
    stopEditing,
  };
}
