import { useMatch, useNavigate } from 'react-router-dom';

import { ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from 'components/ui/context-menu';
import { useLayouts } from 'stores/useLayouts';
import { useWindows } from 'stores/useWindows';

type Props = {
  onAdd: () => void;
  onRemove: () => void;
}

export function LayoutItem(props: Props) {
  const { onAdd, onRemove } = props;

  const match = useMatch('/:encKey');
  const windows = useWindows();
  const layouts = useLayouts();
  const navigate = useNavigate();

  const currentKey = match?.params.encKey;

  if (!windows.stack.length && !layouts.list.length) return null;

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger inset>Layout</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        {windows.stack.length > 0 && (
          <ContextMenuItem onClick={onAdd}>
            Save...
          </ContextMenuItem>
        )}
        {windows.stack.length > 0 && layouts.list.length > 0 && <ContextMenuSeparator />}
        {layouts.list.map((layout) => (
          <ContextMenuItem
            key={layout.key}
            onClick={() => {
              if (currentKey !== layout.key) {
                windows.stopEditing();
                navigate(`/${encodeURIComponent(layout.key)}`);
              }
            }}
          >
            {layout.name}
          </ContextMenuItem>
        ))}
        {layouts.list.length > 0 && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onRemove} className="text-red-400 focus:text-red-400">
              Remove Layouts...
            </ContextMenuItem>
          </>
        )}
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}