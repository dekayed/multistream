import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { useMatch } from 'react-router-dom';

import { Button } from 'components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { useLayouts } from 'stores/useLayouts';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & PropsWithChildren;

export function AddLayoutDialog(props: Props) {
  const { children, open, setOpen } = props;

  const [name, setName] = useState('');
  const match = useMatch('/:encKey');

  const layouts = useLayouts();

  const handleSubmit = () => {
    if (name.length) {
      const key = match!.params.encKey!;
      const layout = { name, key };
      layouts.add(layout);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter a Name</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          {name.length ? (
            <DialogClose>
              <Button onClick={handleSubmit}>Save changes</Button>
            </DialogClose>
          ) : (
            <Button disabled>Save changes</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}