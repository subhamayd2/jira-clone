'use client';

import { Calendar as CalendarIcon } from 'lucide-react';

import React from 'react';
import {
  format, isAfter, isBefore, startOfDay,
} from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';

interface IDatePickerProps {
    value: Date | undefined;
    onChange: (date: Date) => void;
    className?: string;
    placeholder?: string;
    disablePast?: boolean;
    disableFuture?: boolean;
}

const DatePicker = ({
  value, onChange, className, placeholder = 'Select Date',
  disablePast, disableFuture,
}: IDatePickerProps) => (
    <Popover>
        <PopoverTrigger asChild>
            <Button
                variant="outline"
                size="lg"
                icon={<CalendarIcon className="size-4" />}
                className={cn(
                  'w-full justify-start text-left font-normal px-3',
                  !value && 'text-muted-foreground',
                  className,
                )}
            >
                {value ? format(value, 'PPP') : <span>{placeholder}</span>}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
            <Calendar
                mode="single"
                selected={value}
                onSelect={(date) => onChange(date as Date)}
                initialFocus
                disabled={(date) => {
                  if (disablePast && isBefore(startOfDay(date), startOfDay(new Date()))) return true;
                  if (disableFuture && isAfter(startOfDay(date), startOfDay(new Date()))) return true;
                  return false;
                }}
            />
        </PopoverContent>
    </Popover>
);

export default DatePicker;
