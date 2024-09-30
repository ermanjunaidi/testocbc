'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { FormDataSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = z.infer<typeof FormDataSchema>;

const steps = [
  { id: 'Step 1', name: 'metadata', fields: ['blogTitle', 'authorName'] },
  { id: 'Step 2', name: 'summary', fields: ['category', 'summary'] },
  { id: 'Step 3', name: 'content', fields: ['blogContent'] }, 
  { id: 'Step 4', name: 'resume' },
];

export default function Form() {
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState<Inputs | null>(null);
  const delta = useRef(0);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(FormDataSchema) });

  const saveToLocalStorage = () => {
    const formData = getValues();
    localStorage.setItem('formData', JSON.stringify(formData));
  };

  const loadFromLocalStorage = () => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setResumeData(JSON.parse(savedData));
    }
  };

  const processForm: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    reset();
    localStorage.removeItem('formData');
  };

  const next = async () => {
    const fields = steps[currentStep].fields;
    const isValid = await trigger(fields, { shouldFocus: true });

    if (!isValid) return;

    saveToLocalStorage();
    if (currentStep < steps.length - 1) {
      delta.current = 1;
      setCurrentStep((step) => step + 1);
    }

    if (currentStep === steps.length - 2) loadFromLocalStorage();
  };

  const prev = () => {
    if (currentStep > 0) {
      delta.current = -1;
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <section className="absolute inset-0 flex flex-col justify-between p-24">
      <nav aria-label="Progress">
        <ol className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              <div
                className={`group flex w-full flex-col py-2 pl-4 border-l-4 md:pl-0 md:pt-4 ${
                  currentStep === index
                    ? 'border-sky-600'
                    : currentStep > index
                    ? 'border-sky-600'
                    : 'border-gray-200'
                }`}
                aria-current={currentStep === index ? 'step' : undefined}
              >
                <span
                  className={`text-sm font-medium ${
                    currentStep > index || currentStep === index
                      ? 'text-sky-600'
                      : 'text-gray-500'
                  }`}
                >
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      <form className="mt-12 py-12" onSubmit={handleSubmit(processForm)}>
        {currentStep === 0 && (
          <motion.div
            initial={{ x: delta.current >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <h2 className="text-base font-semibold text-gray-900">Blog Metadata</h2>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <InputField
                id="blogTitle"
                label="Blog Title"
                register={register}
                error={errors.blogTitle}
                autoComplete="blog-title"
              />
              <InputField
                id="authorName"
                label="Author Name"
                register={register}
                error={errors.authorName}
                autoComplete="author-name"
              />
            </div>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            initial={{ x: delta.current >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <h2 className="text-base font-semibold text-gray-900">Summary</h2>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <InputField
                id="summary"
                label="Blog Summary"
                register={register}
                error={errors.summary}
                autoComplete="summary"
              />
              <SelectField
                id="category"
                label="Category"
                register={register}
                options={['Tech', 'Life Style', 'Business']}
                error={errors.category}
              />
            </div>
          </motion.div>
        )}

{currentStep === 2 && (
  <motion.div
    initial={{ x: delta.current >= 0 ? '50%' : '-50%', opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
  >
    <h2 className="text-base font-semibold text-gray-900">Content</h2>
    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <InputField
        id="blogContent"
        label="Content"
        register={register}
        error={errors.blogContent}
        autoComplete="content"
      />
    </div>
  </motion.div>
)}

        {currentStep === 3 && resumeData && (
          <div>
            <h2 className="text-base font-semibold text-gray-900">Review Your Information</h2>
            <div className="mt-10 space-y-4">
              <p><strong>Blog Title:</strong> {resumeData.blogTitle}</p>
              <p><strong>Author Name:</strong> {resumeData.authorName}</p>
              <p><strong>Blog Summary:</strong> {resumeData.summary}</p>
              <p><strong>Category:</strong> {resumeData.category}</p>
              <p><strong>Blog Content:</strong> {resumeData.blogContent}</p>
            </div>
          </div>
        )}
      </form>

      <div className="mt-8 pt-5">
        <div className="flex justify-between">
          <NavigationButton direction="prev" onClick={prev} disabled={currentStep === 0} />
          {currentStep < steps.length - 1 ? (
            <NavigationButton direction="next" onClick={next} />
          ) : (
            <button
              type="submit"
              className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
              onClick={handleSubmit(processForm)}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

const InputField = ({ id, label, register, error, type = 'text', autoComplete }) => (
  <div className="sm:col-span-3">
    <label htmlFor={id} className="block text-sm font-medium text-gray-900">
      {label}
    </label>
    <input
      id={id}
      type={type}
      {...register(id)}
      autoComplete={autoComplete}
      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
    />
    {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
  </div>
);

const SelectField = ({ id, label, register, options, error }) => (
  <div className="sm:col-span-3">
    <label htmlFor={id} className="block text-sm font-medium text-gray-900">
      {label}
    </label>
    <select
      id={id}
      {...register(id)}
      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
  </div>
);

const NavigationButton = ({ direction, onClick, disabled = false }) => (
  <button
    type="button"
    className={`${
      disabled ? 'opacity-50 cursor-not-allowed' : 'bg-sky-600 text-white hover:bg-sky-700'
    } rounded px-4 py-2 text-sm font-semibold shadow-sm`}
    onClick={onClick}
    disabled={disabled}
  >
    {direction === 'prev' ? 'Previous' : 'Next'}
  </button>
);
