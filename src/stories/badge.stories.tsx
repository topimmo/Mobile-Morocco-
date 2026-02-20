// [build] library: 'shadcn'
import { Badge } from "../components/ui/badge";

const meta = {
  title: "ui/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {},
};
export default meta;

export const Base = {
  render: (args: Record<string, unknown>) => <Badge {...args}>Badge</Badge>,
  args: {},
};
export const Secondary = {
  render: (args: Record<string, unknown>) => <Badge {...args}>Secondary</Badge>,
  args: {
    variant: "secondary",
  },
};
export const Outline = {
  render: (args: Record<string, unknown>) => <Badge {...args}>Outline</Badge>,
  args: {
    variant: "outline",
  },
};
export const Destructive = {
  render: (args: Record<string, unknown>) => <Badge {...args}>Destructive</Badge>,
  args: {
    variant: "destructive",
  },
};
