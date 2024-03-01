import { LoRAs } from '@/app/constants';
import { Listbox } from '@headlessui/react';

export default function ModelSelect({
  value,
  onChange
}: {
  value: { id: string; name: string }[];
  onChange: (val: any) => void;
}) {
  return (
    <label className="form-control w-full max-w-xs">
      <Listbox
        defaultValue={value}
        by={(a, b) => a.id === b.id}
        onChange={(e) => {
          console.log(e);
          onChange(e);
        }}
        multiple
      >
        <div className="label">
          <Listbox.Label className="label-text">
            Characters / Clothes
          </Listbox.Label>
        </div>
        <Listbox.Button className="input input-bordered w-full max-w-xs h-auto min-h-[3rem] text-left py-2">
          {({ open }) => (
            <>
              {value.map((lora) => (
                <span
                  key={lora.id}
                  className="badge badge-primary p-2 m-1 h-auto rounded-sm"
                  onClick={() => {}}
                >
                  {lora.name}
                </span>
              ))}
            </>
          )}
        </Listbox.Button>
        <Listbox.Options className="menu" as="ul">
          {LoRAs.map((lora) => (
            <li key={lora.id}>
              <Listbox.Option value={lora} as="a">
                {lora.name}
              </Listbox.Option>
            </li>
          ))}
        </Listbox.Options>
      </Listbox>
    </label>
  );
}
