import React, { useState, useEffect } from 'react';
import { Users, Mail, MapPin, Calendar } from 'lucide-react';
import { adminApi } from '../../api/adminApi.js';

export const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getCustomers({ limit: 50 });
        if (res.success) {
          setCustomers(res.customers || []);
          setTotal(res.total || 0);
        }
      } catch (err) {
        console.error('Failed to load customers', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-atelier-200">
        <span className="text-[10px] uppercase tracking-super-wide text-atelier-gold font-semibold">
          Client Directory
        </span>
        <h1 className="font-serif text-3xl text-atelier-950 font-normal mt-1">
          Registered Clients ({total})
        </h1>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-atelier-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-atelier-50 border-b border-atelier-200 text-[10px] uppercase tracking-wider text-atelier-600">
            <tr>
              <th className="p-4 pl-6">Client Name</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Registered Location</th>
              <th className="p-4">Contact Phone</th>
              <th className="p-4 pr-6">Member Since</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-atelier-150">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-atelier-500">
                  Retrieving client records...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-atelier-500">
                  No registered customers found.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c._id} className="hover:bg-atelier-50/70 transition-colors">
                  <td className="p-4 pl-6 font-medium text-atelier-950">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-atelier-150 rounded-full flex items-center justify-center font-bold text-atelier-800 text-[11px]">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{c.name}</span>
                    </div>
                  </td>

                  <td className="p-4 text-atelier-700">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-atelier-400" />
                      <span>{c.email}</span>
                    </div>
                  </td>

                  <td className="p-4 text-atelier-600">
                    {c.shippingAddress?.city ? (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-atelier-400" />
                        <span>
                          {c.shippingAddress.city}, {c.shippingAddress.country}
                        </span>
                      </div>
                    ) : (
                      <span className="text-atelier-400 italic">Not provided</span>
                    )}
                  </td>

                  <td className="p-4 text-atelier-600">
                    {c.shippingAddress?.phone || (
                      <span className="text-atelier-400 italic">None</span>
                    )}
                  </td>

                  <td className="p-4 pr-6 text-atelier-500">
                    {new Date(c.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
