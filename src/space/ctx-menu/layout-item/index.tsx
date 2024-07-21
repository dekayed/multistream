import { useMatch, useNavigate } from 'react-router-dom';

import { ContextMenuCheckboxItem, ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from 'components/ui/context-menu';
import { DialogTrigger } from 'components/ui/dialog';
import { useLayouts } from 'stores/useLayouts';
import { useWindows } from 'stores/useWindows';

export function LayoutItem() {
  const match = useMatch('/:encKey');
  const windows = useWindows();
  const layouts = useLayouts();
  const navigate = useNavigate();

  const currentKey = match?.params.encKey;

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger inset>Layout</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        {windows.stack.length > 0 && (
          <DialogTrigger asChild>
            <ContextMenuItem>
              Save
            </ContextMenuItem>
          </DialogTrigger>
        )}
        {layouts.list.length > 0 && <ContextMenuSeparator />}
        {layouts.list.map((layout) => (
          <ContextMenuCheckboxItem
            key={layout.key}
            checked={currentKey === layout.key}
            onClick={() => {
              if (currentKey !== layout.key) {
                windows.stopEditing();
                navigate(`/${encodeURIComponent(layout.key)}`);
              }
            }}
          >
            {layout.name}
          </ContextMenuCheckboxItem>
        ))}
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}