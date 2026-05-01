import React, { useEffect, useState } from 'react';
import { BudgetOverview } from '../components/BudgetOverview';
import { BudgetBucketCard } from '../components/BudgetBucketCard';
import { BudgetConfigModal } from '../components/BudgetConfigModal';
import { BudgetPlanCard } from '../components/BudgetPlanCard';
import { budgetService } from '../services/budget.service';
import { type BudgetPlan, type BudgetUtilization } from '../types/budget.types';
import { Button, Icon, Spinner, Empty, Modal, ModalHeader } from '@/shared/components/ui';
import BaseLayout from '@/shared/layouts/BaseLayout';
import dayjs from 'dayjs';

export const BudgetPage: React.FC = () => {
  const [plans, setPlans] = useState<BudgetPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [utilization, setUtilization] = useState<BudgetUtilization | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<BudgetPlan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<number | null>(null);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const plansData = await budgetService.getPlans();
      setPlans(plansData);
      
      // If we have a selected plan, fetch its utilization
      if (selectedPlanId) {
        const utilData = await budgetService.getUtilization(selectedPlanId);
        setUtilization(utilData);
      } else {
        setUtilization(null);
      }
    } catch (error) {
      console.error('Failed to fetch budget data', error);
    } finally {
      setLoading(false);
    }
  }, [selectedPlanId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setPlanToDelete(id);
  };

  const confirmDelete = async () => {
    if (!planToDelete) return;
    
    try {
      await budgetService.deletePlan(planToDelete);
      if (selectedPlanId === planToDelete) setSelectedPlanId(null);
      setPlanToDelete(null);
      fetchData();
    } catch (error) {
      console.error('Failed to delete plan', error);
    }
  };

  const handleEdit = (e: React.MouseEvent, plan: BudgetPlan) => {
    e.stopPropagation();
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  if (loading && plans.length === 0) {
    return (
      <BaseLayout>
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner size="lg" color="primary" />
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout 
      pageTitle={selectedPlanId ? utilization?.plan : "Budgeting Control"}
      pagePretitle={selectedPlanId ? "Detail Budget" : "Master Plan"}
      pageActions={
        <div className="btn-list">
          {selectedPlanId ? (
            <>
              <Button element="button" onClick={() => setSelectedPlanId(null)} color="link" className="text-muted border-0 bg-transparent shadow-none">
                <Icon icon="arrow-left" size="sm" className="me-2" />
                Kembali
              </Button>
              <Button 
                color="ghost-secondary" 
                onClick={() => {
                  const plan = plans.find(p => p.id === selectedPlanId);
                  if (plan) {
                    setEditingPlan(plan);
                    setIsModalOpen(true);
                  }
                }}
                className="fw-bold"
                size="md"
              >
                <Icon icon="edit" size="sm" className="me-2" />
                Edit Plan
              </Button>
              <Button 
                color="danger" 
                onClick={(e) => handleDeleteClick(e, selectedPlanId)}
                className="fw-bold"
                size="md"
              >
                <Icon icon="trash" size="sm" className="me-2" />
                Hapus Plan
              </Button>
            </>
          ) : (
            <Button color="primary" onClick={() => { setEditingPlan(null); setIsModalOpen(true); }} element="button" size="md">
              <Icon icon="plus" size="sm" className="me-2" />
              Tambah Plan Baru
            </Button>
          )}
        </div>
      }
    >
      {selectedPlanId && utilization ? (
        <div className="row row-cards">
          <div className="col-12">
            <BudgetOverview utilization={utilization} />
          </div>

          {utilization.items.map(item => (
            <div key={item.id} className="col-md-6 col-lg-4">
              <BudgetBucketCard item={item} />
            </div>
          ))}

          <div className="col-12">
            <div className="card bg-primary-lt border-primary shadow-sm border-2">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-auto">
                    <span className="avatar bg-primary text-white rounded">
                      <Icon icon="coin" size="lg" />
                    </span>
                  </div>
                  <div className="col">
                    <div className="font-weight-bold h4 mb-0">"Safe to Spend" Harian</div>
                    <div className="text-muted small">Sisa budget dibagi jumlah hari tersisa dalam periode ini.</div>
                  </div>
                  <div className="col-auto">
                    {(() => {
                      const remainingBudget = utilization.income_baseline - utilization.items.reduce((s, i) => s + i.spent, 0);
                      const today = dayjs();
                      const end = dayjs(utilization.period_end);
                      const daysLeft = Math.max(1, end.diff(today, 'day') + 1);
                      const safeToSpend = Math.max(0, Math.floor(remainingBudget / daysLeft));
                      
                      return (
                        <div className="h2 mb-0 font-weight-black text-primary">
                          Rp {safeToSpend.toLocaleString('id-ID')} / hari
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : plans.length === 0 ? (
        <Empty 
          title="Belum Ada Budget" 
          subtitle="Mulai kelola keuangan Anda dengan memilih metode yang teruji seperti 50/30/20, Zero-Based, atau Envelope Method."
          icon="wallet"
          buttonText="Pilih Metode Sekarang"
          buttonIcon="plus"
          onClick={() => {
            setEditingPlan(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="row row-cards">
          {plans.map(plan => (
            <div key={plan.id} className="col-md-6 col-lg-4">
              <BudgetPlanCard 
                plan={plan} 
                onClick={() => setSelectedPlanId(plan.id)}
                onEdit={(e) => handleEdit(e, plan)}
                onDelete={(e) => handleDeleteClick(e, plan.id)}
              />
            </div>
          ))}
        </div>
      )}
      
      <BudgetConfigModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData}
        editData={editingPlan}
      />

      <Modal show={!!planToDelete} onClose={() => setPlanToDelete(null)} size="sm">
        <ModalHeader title="Konfirmasi Penghapusan" onClose={() => setPlanToDelete(null)} />
        <div className="modal-body text-center py-4">
          <Icon icon="alert-triangle" size={48} className="text-danger mb-3" />
          <h3>Hapus Budget Plan?</h3>
          <div className="text-secondary mb-3">
            Budget plan ini akan dihapus permanen. Data utilitas terkait periode ini tidak akan hilang, namun rencana anggaran ini tidak akan bisa diakses lagi.
          </div>
          
          <div className="d-flex gap-2">
            <Button className="flex-fill" onClick={() => setPlanToDelete(null)}>
              Batal
            </Button>
            <Button
              color="danger"
              className="flex-fill fw-bold"
              onClick={confirmDelete}
            >
              Ya, Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </BaseLayout>
  );
};
