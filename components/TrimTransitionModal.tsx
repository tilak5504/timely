'use client'

interface Props {
  onClose: () => void
}

export default function TrimTransitionModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full space-y-4 text-center">
        <p className="text-5xl">🫡</p>
        <div>
          <h3 className="text-2xl font-bold">Trim 1 didn't kill you.</h3>
          <p className="text-sm text-gray-500 mt-1">
            Barely. But hey, relax — you made it. Sleep schedule's gone, but that's a story
            for another trim. Let's not go there. Onwards to Trim 2.
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full px-4 py-3 rounded-lg bg-black text-white text-sm font-semibold"
        >
          Let's suffer again 🎓
        </button>
      </div>
    </div>
  )
}
