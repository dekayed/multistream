import type { PropsWithChildren } from 'react';
import { useState } from 'react';

import { Button } from 'components/ui/button';
import { Checkbox } from 'components/ui/checkbox';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'components/ui/dialog';
import type { Favorite } from 'stores/useFavorites';
import { useFavorites } from 'stores/useFavorites';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & PropsWithChildren;

export function RemoveFavoritesDialog(props: Props) {
  const { children, open, setOpen } = props;

  const [selected, setSelected] = useState<Array<Favorite['url']>>([]);

  const favorites = useFavorites();

  const toggleSelect = (url: Favorite['url']) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(url)) {
        return prevSelected.filter((item) => item !== url);
      } else {
        return [...prevSelected, url];
      }
    });
  };

  const handleSubmit = () => {
    if (selected.length) {
      favorites.removeMultiple(selected);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select favorites to remove</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 px-4 py-4 border bg-neutral-900 rounded border-neutral-700 ">
          {favorites.list.map((favorite) =>
            <div className="flex items-center space-x-2">
              <Checkbox id={`favorite-${favorite.url}`} onCheckedChange={() => toggleSelect(favorite.url)} />
              <label
                htmlFor={`favorite-${favorite.url}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {favorite.name}
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