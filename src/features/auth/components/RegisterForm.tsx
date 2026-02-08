import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Input from '@/components/ui/Input'

const registerSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
})

type RegisterFormData = z.infer<typeof registerSchema>

function RegisterForm() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)

    const registerPayload = {
      fullName: data.name, 
      email: data.email,
      password: data.password,
    }

    try {
      await registerUser(registerPayload)
      navigate('/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  }
  const slideDown = {
    hidden: { y: -12, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }
  const slideUp = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <motion.div
      className="w-full max-w-[404px] flex flex-col gap-[25px]"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={slideDown}>
        <h1 className="text-[30px] font-semibold text-brand-dark leading-[100%]">
          Create new account
        </h1>
        <p className="mt-[8px] text-[16px] text-[#78778B] leading-[120%]">
          Welcome back! Please enter your details
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[20px]"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={slideUp}>
          <Input
            label="Full Name"
            type="text"
            placeholder="Mahfuzul Nabil"
            {...register('name')}
            error={errors.name?.message}
            disabled={isLoading}
          />
        </motion.div>

        <motion.div variants={slideUp}>
          <Input
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            {...register('email')}
            error={errors.email?.message}
            disabled={isLoading}
          />
        </motion.div>

        <motion.div variants={slideUp}>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
            disabled={isLoading}
          />
        </motion.div>

        <motion.div variants={slideUp} className="relative">
          <motion.button
            type="submit"
            className="w-full h-[48px] rounded-[10px] text-[16px] font-semibold text-brand-dark bg-brand-lime hover:bg-brand-lime/80 disabled:opacity-70 disabled:pointer-events-none inline-flex items-center justify-center"
            disabled={isLoading}
            whileHover={!isLoading ? { y: -2 } : undefined}
            whileTap={!isLoading ? { scale: 0.95 } : undefined}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.span
                  key="spinner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center justify-center"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                </motion.span>
              ) : (
                <motion.span
                  key="text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Create Account
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </motion.form>

      <motion.div className="flex flex-col gap-[15px]" variants={slideUp}>
        <motion.button
          type="button"
          className="w-full h-[50px] flex items-center justify-center gap-3 border border-[#F5F5F5] rounded-[10px] bg-white hover:bg-gray-50 transition-colors"
          onClick={() => toast('Google sign-up not implemented')}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
          >
            <path
              d="M19.8055 10.2292C19.8055 9.55558 19.7501 8.91669 19.6504 8.30554H10.2V12.0875H15.6014C15.3773 13.3017 14.6571 14.3131 13.5847 15.0194V17.5194H16.8269C18.7147 15.7764 19.8055 13.2292 19.8055 10.2292Z"
              fill="#4285F4"
            />
            <path
              d="M10.2 20C12.9 20 15.1659 19.1042 16.8269 17.5194L13.5847 15.0194C12.6873 15.6181 11.5458 16 10.2 16C7.59474 16 5.38947 14.2403 4.58947 11.85H1.24219V14.4208C2.88947 17.7042 6.32632 20 10.2 20Z"
              fill="#34A853"
            />
            <path
              d="M4.58952 11.85C4.38952 11.2514 4.27895 10.6125 4.27895 9.95556C4.27895 9.29861 4.38952 8.65972 4.58952 8.06111V5.49028H1.24224C0.554545 6.85972 0.166667 8.36806 0.166667 9.95556C0.166667 11.5431 0.554545 13.0514 1.24224 14.4208L4.58952 11.85Z"
              fill="#FBBC05"
            />
            <path
              d="M10.2 3.94306C11.6765 3.94306 13.0085 4.45833 14.0585 5.46528L17.0159 2.50694C15.1659 0.76389 12.9 -0.166668 10.2 -0.166668C6.32632 -0.166668 2.88947 2.12639 1.24219 5.41667L4.58947 7.98056C5.38947 5.59028 7.59474 3.94306 10.2 3.94306Z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-[14px] font-semibold text-[#78778B]">
            Sign up with google
          </span>
        </motion.button>

        <div className="text-center text-[14px] font-normal text-[#78778B]">
          Already have an account?{' '}
          <a
            href="/login"
            className="relative inline-block font-bold text-[#78778B] hover:text-gray-900"
          >
            <span>Sign in</span>
            <span className="pointer-events-none absolute left-0 right-0 -bottom-[6px] flex justify-center">
              <svg
                width="45"
                height="8"
                viewBox="0 0 45 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.901001 6.5C7.47045 1.56444 34.4948 -1.70074 43.901 6.49999"
                  stroke="#C8EE44"
                  strokeWidth="3"
                />
              </svg>
            </span>
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RegisterForm
