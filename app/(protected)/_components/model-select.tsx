import { Listbox } from '@headlessui/react';

import { LoRAs } from '@/app/constants';
import { Badge } from '@/components/ui/badge';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { cn } from '@/lib/utils';

export default function ModelSelect({
  label,
  value,
  onChange,
  className
}: {
  label?: string;
  value: { id: string; name: string }[];
  onChange: (val: unknown) => void;
  className?: string;
}) {
  return (
    <FormItem>
      <Listbox
        defaultValue={value}
        by={(a: { id: string }, b: { id: string }) => a.id === b.id}
        onChange={onChange}
        multiple
      >
        {label && <Listbox.Label as={FormLabel}>{label}</Listbox.Label>}
        <FormControl>
          <Listbox.Button
            className={cn(
              'flex flex-wrap w-full h-auto min-h-[2.5rem] p-2 border border-input rounded-md text-left gap-1',
              className
            )}
          >
            {() => (
              <>
                {value.length === 0 && (
                  <span className="text-sm text-gray-400">Add a model</span>
                )}
                {value.map((lora) => (
                  <Badge key={lora.id} onClick={() => {}}>
                    {lora.name}
                  </Badge>
                ))}
              </>
            )}
          </Listbox.Button>
        </FormControl>
        <Listbox.Options as="ul">
          {LoRAs.map((lora) => (
            <Listbox.Option
              key={lora.id}
              value={lora}
              className="cursor-pointer"
            >
              {lora.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </FormItem>
  );
}
