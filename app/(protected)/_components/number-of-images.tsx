import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';

function NumberButton({ id, value }: { id: string; value: number }) {
  return (
    <div>
      <RadioGroupItem value={String(value)} id={id} className="peer sr-only" />
      <Label
        htmlFor={id}
        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
      >
        {value}
      </Label>
    </div>
  );
}

export default function NumberOfImages({
  value,
  onChange
}: {
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <FormItem>
      <div className="flex flex-col">
        <FormLabel>Number of Images</FormLabel>
        <FormControl>
          <RadioGroup
            defaultValue={String(value)}
            className="grid grid-cols-4 py-2 gap-2"
            onValueChange={(val) => {
              onChange(Number(val));
            }}
          >
            <NumberButton id="one" value={1} />
            <NumberButton id="two" value={2} />
            <NumberButton id="three" value={3} />
            <NumberButton id="four" value={4} />
          </RadioGroup>
        </FormControl>
      </div>
    </FormItem>
  );
}
