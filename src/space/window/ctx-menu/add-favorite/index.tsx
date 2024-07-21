
import type { PropsWithChildren } from 'react';
import { useState } from 'react';

import { Button } from 'components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import type { Favorite } from 'stores/useFavorites';

type Props = {
  url: Favorite['url'];
  onSubmit: (name: string) => void;
} & PropsWithChildren;

export function AddFavoriteDialog(props: Props) {
  const { url, onSubmit, children } = props;

  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.length) {
      onSubmit(name);
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              URL
            </Label>
            <Input
              id="url"
              value={url}
              disabled
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