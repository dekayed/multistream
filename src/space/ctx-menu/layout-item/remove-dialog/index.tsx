import type { PropsWithChildren } from 'react';
import { useState } from 'react';

import { Button } from 'components/ui/button';
import { Checkbox } from 'components/ui/checkbox';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'components/ui/dialog';
import type { Layout } from 'stores/useLayouts';
import { useLayouts } from 'stores/useLayouts';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & PropsWithChildren;

export function RemoveLayoutsDialog(props: Props) {
  const { children, open, setOpen } = props;

  const [selected, setSelected] = useState<Array<Layout['key']>>([]);

  const layouts = useLayouts();

  const toggleSelect = (key: Layout['key']) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(key)) {
        return prevSelected.filter((item) => item !== key);
      } else {
        return [...prevSelected, key];
      }
    });
  };

  const handleSubmit = () => {
    if (selected.length) {
      layouts.removeMultiple(selected);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select layouts to remove</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 px-4 py-4 border bg-neutral-900 rounded border-neutral-700 ">
          {layouts.list.map((layout) =>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" onCheckedChange={() => toggleSelect(layout.key)} />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {layout.name}
              </label>
            </div>
          )}
        </div>
        <DialogFooter>
          {selected.length ? (
            <DialogClose>
              <Button onClick={handleSubmit}>Remove selected</Button>
            </DialogClose>
          ) : (
            <Button disabled>Remove selected</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}