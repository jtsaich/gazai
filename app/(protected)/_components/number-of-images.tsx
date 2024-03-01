import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

function NumberButton({ id, value }: { id: string; value: string }) {
  return (
    <div>
      <RadioGroupItem value={value} id={id} className="peer sr-only" />
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
  value: string;
  onChange: (val: any) => void;
}) {
  return (
    <div className="flex flex-col">
      <div className="label">
        <span className="label-text">Number of Images</span>
      </div>
      <RadioGroup
        defaultValue={value}
        className="grid grid-cols-4 gap-2"
        onValueChange={onChange}
      >
        <NumberButton id="one" value="1" />
        <NumberButton id="two" value="2" />
        <NumberButton id="three" value="3" />
        <NumberButton id="four" value="4" />
      </RadioGroup>
    </div>
  );
}
