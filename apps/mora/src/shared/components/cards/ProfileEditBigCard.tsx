import React, { useState } from 'react';

interface ProfileEditBigCardProps {
  initialValues?: {
    company?: string; username?: string; email?: string;
    firstName?: string; lastName?: string; address?: string;
    city?: string; postal?: string; country?: string; bio?: string;
  };
  onSubmit?: (data: Record<string, string>) => void;
}

export function ProfileEditBigCard({ initialValues = {}, onSubmit }: ProfileEditBigCardProps) {
  const [form, setForm] = useState({
    company: 'Creative Code Inc.', username: 'michael23', email: '',
    firstName: 'Chet', lastName: 'Faker', address: 'Melbourne, Australia',
    city: 'Melbourne', postal: '', country: 'Germany', bio: '',
    ...initialValues,
  });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Edit Profile</h3>
        <div className="row">
          <div className="col-md-5 mb-2"><label className="form-label">Company</label>
            <input type="text" className="form-control" disabled value={form.company} onChange={set('company')} /></div>
          <div className="col-sm-6 col-md-3 mb-2"><label className="form-label">Username</label>
            <input type="text" className="form-control" value={form.username} onChange={set('username')} /></div>
          <div className="col-sm-6 col-md-4 mb-2"><label className="form-label">Email address</label>
            <input type="email" className="form-control" placeholder="Email" value={form.email} onChange={set('email')} /></div>
          <div className="col-sm-6 col-md-6 mb-2"><label className="form-label">First Name</label>
            <input type="text" className="form-control" value={form.firstName} onChange={set('firstName')} /></div>
          <div className="col-sm-6 col-md-6 mb-2"><label className="form-label">Last Name</label>
            <input type="text" className="form-control" value={form.lastName} onChange={set('lastName')} /></div>
          <div className="col-md-12 mb-2"><label className="form-label">Address</label>
            <input type="text" className="form-control" value={form.address} onChange={set('address')} /></div>
          <div className="col-sm-6 col-md-4 mb-2"><label className="form-label">City</label>
            <input type="text" className="form-control" value={form.city} onChange={set('city')} /></div>
          <div className="col-sm-6 col-md-3 mb-2"><label className="form-label">Postal Code</label>
            <input type="number" className="form-control" value={form.postal} onChange={set('postal')} /></div>
          <div className="col-md-5 mb-2"><label className="form-label">Country</label>
            <select className="form-select" value={form.country} onChange={set('country')}>
              <option>Germany</option><option>USA</option><option>Poland</option>
            </select></div>
          <div className="col-md-12 mb-2"><label className="form-label">About Me</label>
            <textarea rows={5} className="form-control" value={form.bio} onChange={set('bio')} /></div>
        </div>
      </div>
      <div className="card-footer text-end">
        <button type="button" className="btn btn-primary" onClick={() => onSubmit?.(form)}>Update Profile</button>
      </div>
    </div>
  );
}
