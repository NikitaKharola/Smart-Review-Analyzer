import { useState } from "react";
import {
  Button,
  Input,
  Modal,
  Toast,
  Loader,
} from "../components/ui";

function ComponentDemo() {
  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState("");

  return (
    <div className="p-8 space-y-6 min-h-screen bg-white dark:bg-slate-900">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Component Library Demo
      </h1>

      <Input
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex gap-4">
        <Button
          text="Show Toast"
          onClick={() => {
            setToast("Toast Component Working!");
            setTimeout(() => setToast(""), 3000);
          }}
        />

        <Button
          text="Open Modal"
          onClick={() => setShowModal(true)}
        />
      </div>

      <div>
        <p className="mb-2 text-slate-900 dark:text-white">
          Loader Component:
        </p>
        <Loader size="large" />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <h2 className="text-xl font-bold mb-2">
          Modal Component
        </h2>
        <p>This modal is working correctly.</p>
      </Modal>

      <Toast message={toast} />
    </div>
  );
}

export default ComponentDemo;