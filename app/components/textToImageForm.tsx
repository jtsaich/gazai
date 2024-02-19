'use client';

import axios from 'axios';
import { useForm } from 'react-hook-form';
import Input from './input';
import Select from './select';

interface FormValues {
  prompt: string;
  negativePrompt: string;
  outputImageSize: string;
}

function TextToImageForm() {
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      prompt: '',
      negativePrompt:
        '(((3d))), easynegative, ((((ugly)))), (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), (fused fingers), (too many fingers), (((long neck)))',
      outputImageSize: '1024'
    }
  });

  const onSubmit = async (data: FormValues) => {
    // st.session_state['prompt_prefix'] + prompt,
    // neg_prompt=neg_prompt,
    // height=1024,
    // width=1024,
    // batch_size=n_output,
    // cfg_scale=cfg_scale

    try {
      const response = await axios.post('/api/gen/txt2img', {
        prompt: data.prompt,
        negativePrompt: data.negativePrompt,
        height: data.outputImageSize,
        width: data.outputImageSize
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    // try {
    //   const response = await axios.post('/api/translate', { text: '女' });
    //   console.log(response.data);
    // } catch (error) {
    //   console.error(error);
    // }

    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Prompt" name="prompt" register={register} />
      <Input
        label="Negative prompt"
        name="negativePrompt"
        register={register}
      />
      <Select
        label="Output image size"
        name="outputImageSize"
        options={[
          { label: '1024', value: '1024' },
          { label: '768', value: '768' },
          { label: '512', value: '512' }
        ]}
        register={register}
      />
      <input type="submit" className="btn btn-primary" />
    </form>
  );
}

export default TextToImageForm;
