import { CheckCircleIcon } from '@heroicons/react/20/solid';

type FormSuccessProps = {
  message?: string;
};

const FormSuccess = ({ message }: FormSuccessProps) => {
  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <CheckCircleIcon className="h-4 w-4 flex-none" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
