import { Suspense } from 'react';

import { SignupContent } from './SignupContent';

export default function Signup() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
