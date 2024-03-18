import { Listbox } from '@headlessui/react';

import { LoRAs } from '@/app/constants';
import { Badge } from '@/components/ui/badge';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';

export default function ModelSelect({
  value,
  onChange
}: {
  value: { id: string; name: string }[];
  onChange: (val: unknown) => void;
}) {
  return (
    <FormItem>
      <Listbox
        defaultValue={value}
        by={(a: { id: string }, b: { id: string }) => a.id === b.id}
        onChange={onChange}
        multiple
      >
        <Listbox.Label as={FormLabel}>Characters / Clothes</Listbox.Label>
        <FormControl>
          <Listbox.Button className="flex flex-wrap w-full h-auto min-h-[3rem] p-2 border border-input rounded-md text-left gap-1">
            {() => (
              <>
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
