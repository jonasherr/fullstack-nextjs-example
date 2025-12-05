import type { FieldMetadata } from "@conform-to/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function ConformField({
  field,
  label,
  description,
  children,
}: {
  field: FieldMetadata<string | number | unknown>;
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  const errors = field.errors;

  return (
    <div className="grid gap-2">
      <Label
        htmlFor={field.id}
        className={cn(errors?.length && "text-destructive")}
      >
        {label}
      </Label>
      {children}
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
      {errors?.map((error, i) => (
        <p key={i} className="text-destructive text-sm">
          {error}
        </p>
      ))}
    </div>
  );
}

export function ConformInput({
  field,
  value,
  ...props
}: {
  field: FieldMetadata;
} & React.ComponentProps<typeof Input>) {
  return (
    <Input
      key={field.key}
      name={field.name}
      defaultValue={field.initialValue as any}
      {...props}
    />
  );
}

export function ConformTextarea({
  field,
  ...props
}: {
  field: FieldMetadata;
} & React.ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      key={field.key}
      name={field.name}
      defaultValue={field.initialValue as any}
      {...props}
    />
  );
}
