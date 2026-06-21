import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const StoreSectionHeading = ({ eyebrow, title, description, align = 'left', actions }) => {
  const alignment = align === 'center' ? 'mx-auto text-center items-center' : 'items-start';

  return (
    <motion.div
      className={`mb-8 flex max-w-2xl flex-col gap-3 ${alignment}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)] backdrop-blur-xl">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] text-[var(--ink-strong)] sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-xl text-sm leading-7 text-[var(--ink-soft)] sm:text-base">
          {description}
        </p>
      ) : null}
      {actions ? <div className="pt-2">{actions}</div> : null}
    </motion.div>
  );
};

export default StoreSectionHeading;
